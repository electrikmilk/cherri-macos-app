//
//  ActionSearchTests.swift
//  CherriTests
//

import XCTest
@testable import Cherri

final class ActionSearchDocsParserTests: XCTestCase {
    private let helpWithDocsCategories = """
    USAGE: ./cherri_binary [FILE] [-v -h --action= --glyph= --docs= --subcat=]
    Options:
    \t    \t --action=             \t Search for available actions. Empty prints all definitions.
    \t    \t --docs=               \t Generate action documentation, optionally by category. [basic, a11y, text]
    \t    \t --subcat=             \t Filter action documentation category by subcategory.
    """

    private let deviceDocs = """
    # Device Actions

    To use actions in this category, use this include statement:

    ```
    #include 'actions/device'
    ```

    ## Battery

    ### Charge Limit

    Set the battery charge limit.

    ```
    setChargeLimit(number limit)
    ```

    ---

    ## Display

    ### Lock Screen

    Lock the device screen.

    ```
    lockScreen()
    ```

    Requires version 17 or later.

    """

    private let basicDocs = """
    # Basic Actions

    Actions in this category are automatically included.

    ### Comment

    Add an explicit comment.

    ```
    comment(text comment)
    ```

    """

    private let mediaDocsWithRepeatedTitle = """
    # Media Actions

    To use actions in this category, use this include statement:

    ```
    #include 'actions/media'
    ```

    ### Take Photo

    Prompt the user to start recording a video.

    ```
    takeVideo(bool ?showPreview = true)
    ```

    ---

    ### Take Photo

    Prompt the user to take one or more photos.

    ```
    takePhoto(number ?count = 1, bool ?showPreview = true)
    ```

    """

    func testCategoryNamesAreReadFromTheDocsOptionLine() throws {
        let names = try CherriDocsParser.categoryNames(fromHelp: helpWithDocsCategories)

        XCTAssertEqual(names, ["basic", "a11y", "text"])
    }

    func testHelpWithoutDocsCategoriesThrows() {
        let helpWithoutDocsOption = "USAGE: ./cherri_binary [FILE] [-v -h]\nOptions:\n\t -v --version Print version information."

        XCTAssertThrowsError(try CherriDocsParser.categoryNames(fromHelp: helpWithoutDocsOption)) { error in
            XCTAssertEqual(error as? CherriActionRegistryError, .categoriesNotListed)
        }
    }

    func testDocsEntriesCarryCategoryIncludeAndSubcategory() throws {
        let parsed = try CherriDocsParser.entries(fromDocs: deviceDocs, category: "device")

        XCTAssertEqual(parsed.category, CherriActionCategory(name: "device",
                                                             includePath: "actions/device",
                                                             subcategories: ["Battery", "Display"]))
        XCTAssertEqual(parsed.entries.map(\.action.identifier), ["setChargeLimit", "lockScreen"])
        XCTAssertEqual(parsed.entries.map(\.subcategory), ["Battery", "Display"])
        XCTAssertEqual(parsed.entries.map(\.category), [parsed.category, parsed.category])
    }

    func testBasicDocsHaveNoIncludePath() throws {
        let parsed = try CherriDocsParser.entries(fromDocs: basicDocs, category: "basic")

        XCTAssertNil(parsed.category.includePath)
        XCTAssertEqual(parsed.entries.map(\.action.identifier), ["comment"])
    }

    func testDuplicateTitlesStayDistinctActions() throws {
        let parsed = try CherriDocsParser.entries(fromDocs: mediaDocsWithRepeatedTitle, category: "media")

        XCTAssertEqual(parsed.entries.map(\.action.identifier), ["takeVideo", "takePhoto"])
        XCTAssertEqual(parsed.entries.map(\.action.title), ["Take Photo", "Take Photo"])
    }

    func testDocsWithoutACategoryHeadingThrow() {
        XCTAssertThrowsError(try CherriDocsParser.entries(fromDocs: "### Comment\n", category: "basic")) { error in
            XCTAssertEqual(error as? CherriActionRegistryError, .missingCategoryHeading(category: "basic"))
        }
    }
}

/// These tests run the compiler bundled with the app, so they check the registry against what the app ships with.
final class ActionSearchRegistryTests: XCTestCase {
    func testRegistryListsEveryCompilerActionExactlyOnce() async throws {
        let registryIdentifiers = try await CherriActionRegistry.shared.contents().entries.map(\.action.identifier)
        let catalogIdentifiers = try await CherriCatalog.shared.entries().actions.map(\.identifier)

        XCTAssertEqual(registryIdentifiers.sorted(), catalogIdentifiers.sorted())
    }

    func testOnlyActionsOutsideEveryCategoryAreUncategorized() async throws {
        let entries = try await CherriActionRegistry.shared.contents().entries
        let uncategorizedIdentifiers = Set(entries.filter { $0.category == nil }.map(\.action.identifier))

        XCTAssertEqual(uncategorizedIdentifiers, ["rawAction", "text", "makeVCard", "embedFile"])
    }

    func testCategoriesComeFromTheCompilerHelp() async throws {
        let categoryNames = try await CherriActionRegistry.shared.contents().categories.map(\.name)

        XCTAssertTrue(categoryNames.contains("basic"))
        XCTAssertTrue(categoryNames.contains("device"))
        XCTAssertTrue(categoryNames.contains("text"))
    }
}

private func makeEntry(_ identifier: String,
                       title: String = "",
                       summary: String = "",
                       takesParameters: Bool = false,
                       category: CherriActionCategory? = nil) -> CherriActionEntry {
    let signature = takesParameters ? "\(identifier)(text value)" : "\(identifier)()"
    return CherriActionEntry(action: CherriAction(identifier: identifier,
                                                  title: title,
                                                  summary: summary,
                                                  definition: signature,
                                                  signature: signature,
                                                  notes: []),
                             category: category,
                             subcategory: nil)
}

final class ActionSearchRankerTests: XCTestCase {
    private let getPDFText = makeEntry("getPDFText", title: "Get PDF Text", summary: "Get text from PDF.")
    private let askChatGPT = makeEntry("askChatGPT", title: "Ask Chat GPT", summary: "Ask Chat GPT using a prompt.")
    private let cheatGopherTool = makeEntry("cheatGopherTool", title: "Cheat Gopher Tool", summary: "Unrelated.")
    private let makeDiskImage = makeEntry("makeDiskImage", title: "Make Disk Image", summary: "Create a new disk image.")
    private let playNext = makeEntry("playNext", title: "Play Next", summary: "Play next.")
    private let playLater = makeEntry("playLater", title: "Play Next", summary: "Play later.")
    private let skipTrack = makeEntry("skipTrack", title: "Skip Track", summary: "Skip to the next track, or play it.")

    private var allEntries: [CherriActionEntry] {
        [getPDFText, askChatGPT, cheatGopherTool, makeDiskImage, playNext, playLater, skipTrack]
    }

    private func rankedIdentifiers(for query: String) -> [String] {
        ActionSearchRanker.rank(allEntries, matching: query).map(\.action.identifier)
    }

    func testSubsequenceMatchesIdentifier() {
        XCTAssertEqual(rankedIdentifiers(for: "gpdf"), ["getPDFText"])
    }

    func testContiguousMatchOutranksSubsequence() {
        XCTAssertEqual(rankedIdentifiers(for: "chatgpt"), ["askChatGPT", "cheatGopherTool"])
    }

    func testQueryIsCaseAndSpaceInsensitive() {
        XCTAssertEqual(rankedIdentifiers(for: "GETPDF"), ["getPDFText"])
        XCTAssertEqual(rankedIdentifiers(for: "get pdf"), ["getPDFText"])
    }

    func testDescriptionWordsMatch() {
        XCTAssertEqual(rankedIdentifiers(for: "new disk"), ["makeDiskImage"])
    }

    func testPrefixOutranksDescriptionOnlyMatch() {
        XCTAssertEqual(rankedIdentifiers(for: "play"), ["playLater", "playNext", "skipTrack"])
    }

    func testNoMatchReturnsEmpty() {
        XCTAssertEqual(rankedIdentifiers(for: "zzzz"), [])
    }

    func testEmptyQueryReturnsAllInOriginalOrder() {
        XCTAssertEqual(rankedIdentifiers(for: ""), allEntries.map(\.action.identifier))
        XCTAssertEqual(rankedIdentifiers(for: "   "), allEntries.map(\.action.identifier))
    }
}

final class ActionInsertionTests: XCTestCase {
    private let textCategory = CherriActionCategory(name: "text", includePath: "actions/text", subcategories: [])
    private let basicCategory = CherriActionCategory(name: "basic", includePath: nil, subcategories: [])

    private var define: CherriActionEntry {
        makeEntry("define", takesParameters: true, category: textCategory)
    }

    private func endOfText(_ text: String) -> NSRange {
        NSRange(location: text.utf16.count, length: 0)
    }

    func testInsertsActionAndIncludeIntoEmptyText() {
        let result = ActionInsertion.insert(define, into: "", replacing: NSRange(location: 0, length: 0))

        let expectedText = "#include 'actions/text'\ndefine("
        XCTAssertEqual(result, ActionInsertionResult(text: expectedText, selection: endOfText(expectedText)))
    }

    func testIncludeGoesBelowLastExistingInclude() {
        let text = "#include 'actions/device'\n#define color red\n"

        let result = ActionInsertion.insert(define, into: text, replacing: endOfText(text))

        let expectedText = "#include 'actions/device'\n#include 'actions/text'\n#define color red\ndefine("
        XCTAssertEqual(result, ActionInsertionResult(text: expectedText, selection: endOfText(expectedText)))
    }

    func testIncludeAfterLastLineWithoutTrailingNewline() {
        let text = "x\n#include 'actions/device'"

        let result = ActionInsertion.insert(define, into: text, replacing: NSRange(location: 0, length: 0))

        XCTAssertEqual(result.text, "define(x\n#include 'actions/device'\n#include 'actions/text'\n")
        XCTAssertEqual(result.selection, NSRange(location: "define(".utf16.count, length: 0))
    }

    func testExistingIncludeIsNotDuplicated() {
        for existingInclude in ["#include \"actions/text\"\n", "#include   'actions/text'\n"] {
            let result = ActionInsertion.insert(define, into: existingInclude, replacing: endOfText(existingInclude))

            XCTAssertEqual(result.text, "\(existingInclude)define(")
        }
    }

    func testBasicCategoryAddsNoInclude() {
        let comment = makeEntry("comment", takesParameters: true, category: basicCategory)

        let result = ActionInsertion.insert(comment, into: "", replacing: NSRange(location: 0, length: 0))

        XCTAssertEqual(result.text, "comment(")
    }

    func testUncategorizedActionAddsNoInclude() {
        let rawAction = makeEntry("rawAction", takesParameters: true)

        let result = ActionInsertion.insert(rawAction, into: "", replacing: NSRange(location: 0, length: 0))

        XCTAssertEqual(result.text, "rawAction(")
    }

    func testActionWithoutParametersInsertsEmptyParentheses() {
        let lockScreen = makeEntry("lockScreen", category: basicCategory)

        let result = ActionInsertion.insert(lockScreen, into: "", replacing: NSRange(location: 0, length: 0))

        XCTAssertEqual(result, ActionInsertionResult(text: "lockScreen()", selection: NSRange(location: 12, length: 0)))
    }

    func testSelectionIsReplaced() {
        let comment = makeEntry("comment", takesParameters: true, category: basicCategory)

        let result = ActionInsertion.insert(comment, into: "x abc y", replacing: NSRange(location: 2, length: 3))

        XCTAssertEqual(result, ActionInsertionResult(text: "x comment( y", selection: NSRange(location: 10, length: 0)))
    }

    func testCaretAboveIncludesIsNotShifted() {
        let text = "// notes\n#include 'actions/device'\n"

        let result = ActionInsertion.insert(define, into: text, replacing: NSRange(location: 0, length: 0))

        XCTAssertEqual(result.text, "define(// notes\n#include 'actions/device'\n#include 'actions/text'\n")
        XCTAssertEqual(result.selection, NSRange(location: "define(".utf16.count, length: 0))
    }

    func testSelectionOverlappingTheIncludeBlockStillReplacesExactlyTheSelectedText() {
        let text = "#include 'actions/device'\nbody\n"
        let selection = NSRange(location: 24, length: 4)

        let result = ActionInsertion.insert(define, into: text, replacing: selection)

        let includeLine = "#include 'actions/text'\n"
        XCTAssertEqual(result.text.components(separatedBy: includeLine).count - 1, 1)
        XCTAssertEqual(result.text.replacingOccurrences(of: includeLine, with: ""),
                       (text as NSString).replacingCharacters(in: selection, with: "define("))
        XCTAssertTrue((result.text as NSString).substring(to: result.selection.location).hasSuffix("define("))
    }
}
