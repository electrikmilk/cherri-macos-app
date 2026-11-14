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
