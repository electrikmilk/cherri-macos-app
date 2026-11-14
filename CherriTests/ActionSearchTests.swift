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

final class ActionSearchRankerTests: XCTestCase {
    private let getPDFText = entry("getPDFText", title: "Get PDF Text", summary: "Get text from PDF.")
    private let askChatGPT = entry("askChatGPT", title: "Ask Chat GPT", summary: "Ask Chat GPT using a prompt.")
    private let cheatGopherTool = entry("cheatGopherTool", title: "Cheat Gopher Tool", summary: "Unrelated.")
    private let makeDiskImage = entry("makeDiskImage", title: "Make Disk Image", summary: "Create a new disk image.")
    private let playNext = entry("playNext", title: "Play Next", summary: "Play next.")
    private let playLater = entry("playLater", title: "Play Next", summary: "Play later.")
    private let skipTrack = entry("skipTrack", title: "Skip Track", summary: "Skip to the next track, or play it.")

    private var allEntries: [CherriActionEntry] {
        [getPDFText, askChatGPT, cheatGopherTool, makeDiskImage, playNext, playLater, skipTrack]
    }

    private static func entry(_ identifier: String, title: String, summary: String) -> CherriActionEntry {
        CherriActionEntry(action: CherriAction(identifier: identifier,
                                               title: title,
                                               summary: summary,
                                               definition: "\(identifier)()",
                                               signature: "\(identifier)()",
                                               notes: []),
                          category: nil,
                          subcategory: nil)
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
