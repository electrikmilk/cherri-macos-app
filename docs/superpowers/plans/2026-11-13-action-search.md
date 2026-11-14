# Action search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a quick-open overlay to the Cherri macOS app that fuzzy-searches actions by identifier and description, filters by category, inserts the chosen action (plus its include line), and shows full details in an info popover.

**Architecture:** A new actor-backed registry loads categories from `cherri --help`, then each category's actions from `cherri --docs=<category>`, separate from the autocomplete catalog. Fuzzy ranking and text insertion are pure functions. A SwiftUI overlay in `ContentView` ties them together, opened by a menu command.

**Tech Stack:** Swift 5, SwiftUI (macOS 14 deployment target), XCTest, the bundled `cherri_binary` compiler.

**Spec:** `docs/superpowers/specs/2026-11-13-action-search-design.md`

## Global Constraints

- Use the compiler as it is. No change to the Go compiler or the bundled binary.
- Categories come from a regex on the `--docs=` option line of `--help` output (the names are in square brackets on that line).
- Each category's actions come from `--docs=<category>`. Actions are identified by the function name in their signature, never by title (titles repeat: `Play Next`, `Take Photo`).
- The registry is separate from `CherriCatalog` and from autocomplete. Autocomplete behavior does not change.
- Every action is in exactly one category. The four actions only `--action=` lists (`rawAction()`, `text()`, `Base 64 Embed File`, `Make VCard`) appear under "All" only and need no include line.
- The `basic` category has no include line.
- Inserted text matches autocomplete: `name(` when the action takes parameters, else `name()`.
- The include goes directly below the last existing `#include` line, or at the very top when there is none. An include already present (same path, either quote style) is not added again.
- UI follows Apple's Human Interface Guidelines with standard SwiftUI controls and system styling: `List` with selection, `Picker`, `TextField`, `Button` with SF Symbols, `.popover`, system text styles (`.body`, `.callout`, `.monospaced()`), semantic colors (`.primary`, `.secondary`) and system materials. No custom-drawn controls, hard-coded colors or fixed font sizes unless a native control cannot do the job. Dark mode, accessibility and keyboard navigation should come from the native controls.
- Errors are raised and shown, never swallowed. No fallbacks.
- `Cherri.xcodeproj` uses objectVersion 56, so new Swift files are not picked up automatically. Each new file needs a `PBXBuildFile`, a `PBXFileReference`, a group child entry and a `PBXSourcesBuildPhase` entry in `project.pbxproj` (test files go in the `CherriTests` target's phase).
- The repo is in iCloud-synced Documents: wrap `git` and `xcodebuild` in `timeout`. Never kill the app by name (`pkill Cherri`); the user may be debugging it in Xcode.
- Commit messages are imperative, one commit per task, ending with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- Insert into an empty file or with the cursor at the very end: text and caret land correctly (Task 4 test).
- File already has the include with double quotes or extra spaces: no duplicate include (Task 4 test).
- A non-empty selection: replaced by the action text, including when the include insertion point falls inside the selection (Task 4 tests).
- Queries with capitals, spaces or punctuation (`GETPDF`, `get pdf`, `disk image`) still find the action, and a query matching nothing returns an empty list (Task 3 tests).
- `--help` without a `--docs=` category list, or a `--docs=` listing with no include header (basic): the first throws a specific error, the second yields `includePath == nil` (Task 1 tests).

---

### Task 1: Docs parser and registry models

**Files:**
- Create: `Cherri/CherriActionRegistry.swift`
- Modify: `Cherri/CherriCatalog.swift:66` (make `CherriCatalogParser.action(from:)` internal instead of `private`)
- Test: `CherriTests/ActionSearchTests.swift`

**Interfaces:**
- Consumes: `CherriCatalogParser.action(from block: String) throws -> CherriAction`, `CherriCatalogError`.
- Produces:
  - `struct CherriActionCategory: Sendable, Equatable { let name: String; let includePath: String?; let subcategories: [String] }`
  - `struct CherriActionEntry: Sendable, Identifiable { let action: CherriAction; let category: CherriActionCategory?; let subcategory: String?; var id: String { action.identifier } }` (`category == nil` means uncategorized)
  - `enum CherriActionRegistryError: LocalizedError { case categoriesNotListed; case missingCategoryHeading(category: String) }`
  - `enum CherriDocsParser { static func categoryNames(fromHelp help: String) throws -> [String]; static func entries(fromDocs docs: String, category: String) throws -> (category: CherriActionCategory, entries: [CherriActionEntry]) }`

- [ ] **Step 1: Write the failing tests** in `CherriTests/ActionSearchTests.swift` (add the file to the `CherriTests` target). Fixtures are short strings copied from real compiler output.
  - `testCategoryNamesAreReadFromTheDocsOptionLine`: a help string containing the usage line (`... --docs= --subcat=]`) and the option line `--docs=   Generate action documentation, optionally by category. [basic, a11y, text]` returns `["basic", "a11y", "text"]`.
  - `testHelpWithoutDocsCategoriesThrows`: help with no `--docs=` option line throws `CherriActionRegistryError.categoriesNotListed`.
  - `testDocsEntriesCarryCategoryIncludeAndSubcategory`: a `--docs=device` fixture (heading `# Device Actions`, fenced `#include 'actions/device'`, `## Battery`, then two `### ` blocks, the second after a `## Display` heading with no `---` before it) yields category `device` with `includePath == "actions/device"`, `subcategories == ["Battery", "Display"]`, and two entries whose `subcategory` values are `Battery` and `Display` and whose identifiers come from the signatures.
  - `testBasicDocsHaveNoIncludePath`: a fixture containing `Actions in this category are automatically included.` yields `includePath == nil`.
  - `testDuplicateTitlesStayDistinctActions`: a media fixture with two blocks titled `Take Photo` (signatures `takeVideo(...)` and `takePhoto(...)`) yields two entries with identifiers `takeVideo` and `takePhoto`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd "/Users/brandonjordan/Documents/Xcode Projects/Cherri" && timeout 600 xcodebuild test -project Cherri.xcodeproj -scheme Cherri -only-testing:CherriTests/ActionSearchTests`
Expected: FAIL (types not defined). If the `Cherri` scheme does not include `CherriTests`, enable it in the scheme first.

- [ ] **Step 3: Implement the models and `CherriDocsParser`.** `categoryNames` matches `/--docs=.*?\[(?<names>[^\]]+)\]/` (the lazy `.*?` cannot cross a newline, so the usage line, which has no `[` after `--docs=`, does not match) and splits the capture on commas, trimming spaces; no match throws `categoriesNotListed`. `entries` walks the lines: `# ` ends the intro, the include path comes from the first `#include '<path>'` line in the intro (nil if absent), `## ` lines start a subcategory, and each `### ` line starts a block that runs to the next `### `, `## ` or `# ` line with a trailing `---` removed; each block goes to `CherriCatalogParser.action(from:)`. The heading-less case throws `missingCategoryHeading`.

- [ ] **Step 4: Run the tests to verify they pass** (same command). Expected: PASS.

- [ ] **Step 5: Add the file to the Xcode project, then commit**

```bash
cd "/Users/brandonjordan/Documents/Xcode Projects/Cherri" && timeout 60 git add Cherri CherriTests Cherri.xcodeproj && timeout 60 git commit -m "Parse action categories and docs for the action search"
```

### Task 2: Action registry actor

**Files:**
- Modify: `Cherri/CherriCatalog.swift:126` (make `CherriCatalog.run(_:)` internal instead of `private static`)
- Modify: `Cherri/CherriActionRegistry.swift`

**Interfaces:**
- Consumes: `CherriCatalog.run(_ arguments: [String]) async throws -> String`, `CherriCatalog.shared.entries() async throws -> CherriCatalog.Entries`, `CherriDocsParser` from Task 1.
- Produces: `actor CherriActionRegistry { static let shared: CherriActionRegistry; struct Contents: Sendable { let categories: [CherriActionCategory]; let entries: [CherriActionEntry] }; func contents() async throws -> Contents }`. Entries are sorted by lowercased identifier. Uncategorized entries (from the catalog, identifiers not in any category) have `category == nil`.

- [ ] **Step 1: Implement `CherriActionRegistry`** modeled on `CherriCatalog` (a cached `Task`, reset on failure so a later call retries). `load` runs `["--help", "--no-ansi"]`, reads names with `CherriDocsParser.categoryNames`, runs `["--docs=\(name)", "--no-ansi"]` for every category concurrently with a task group, then appends every `CherriCatalog` action whose identifier is not in any category as an entry with `category == nil` and `subcategory == nil`. Category order follows the `--help` list.

- [ ] **Step 2: Verify against the real compiler.** Temporarily print `contents.entries.count` and the number of uncategorized entries at app launch, or run the same compiler commands in a script, and confirm: total entries equal the `--action=` action count (433 at the time of writing), exactly 4 are uncategorized (`rawAction`, `text`, and the two titled `Base 64 Embed File` and `Make VCard`), and no identifier appears twice. Remove the temporary print. Expected: all three hold. If a count differs, stop and report it before continuing.

- [ ] **Step 3: Build and commit**

```bash
cd "/Users/brandonjordan/Documents/Xcode Projects/Cherri" && timeout 600 xcodebuild build -project Cherri.xcodeproj -scheme Cherri
```
Expected: BUILD SUCCEEDED, then `git add` the two files and commit "Add the action registry for the action search".

### Task 3: Fuzzy ranking

**Files:**
- Create: `Cherri/ActionSearchRanker.swift`
- Test: `CherriTests/ActionSearchTests.swift`

**Interfaces:**
- Consumes: `CherriActionEntry` from Task 1.
- Produces: `enum ActionSearchRanker { static func rank(_ entries: [CherriActionEntry], matching query: String) -> [CherriActionEntry] }`. Empty or whitespace-only query returns `entries` unchanged. Otherwise only matching entries are returned, best first, ties broken by lowercased identifier.

Matching rules (case-insensitive, whitespace removed from the query for identifier matching):
- Identifier match: the query characters appear in order in the identifier. Score +100 when the identifier starts with the query, +50 when it contains the query contiguously, +10 for each pair of consecutive matched characters, +5 for each matched character that starts a camelCase word, minus the index of the first matched character.
- Description match: the query is split on whitespace and every token must be a subsequence of some single word in the entry's title plus summary. Score is 20 per matched token, always below any identifier prefix or contiguous match.
- An entry matches if either rule matches; its score is the higher of the two.

- [ ] **Step 1: Write the failing tests** using small hand-built `CherriActionEntry` values (`getPDFText` "Get PDF Text / Get text from PDF.", `askChatGPT` "Ask Chat GPT / Ask Chat GPT using a prompt.", `makeDiskImage` "Make Disk Image / Create a new disk image.", `playNext`, `playLater` both titled "Play Next"):
  - `testSubsequenceMatchesIdentifier`: `"gpdf"` returns `getPDFText` first.
  - `testContiguousMatchOutranksSubsequence`: `"chatgpt"` ranks `askChatGPT` first and returns only it.
  - `testQueryIsCaseAndSpaceInsensitive`: `"GETPDF"` and `"get pdf"` both return `getPDFText`.
  - `testDescriptionWordsMatch`: `"disk image"` returns `makeDiskImage`.
  - `testPrefixOutranksDescriptionOnlyMatch`: `"play"` returns `playLater` and `playNext` in identifier order before any description-only match.
  - `testNoMatchReturnsEmpty`: `"zzzz"` returns `[]`.
  - `testEmptyQueryReturnsAllInOriginalOrder`.

- [ ] **Step 2: Run the tests to verify they fail**, same `xcodebuild test` command with `-only-testing:CherriTests/ActionSearchTests`. Expected: FAIL.

- [ ] **Step 3: Implement `ActionSearchRanker.rank`** per the rules above, as a pure function over value types.

- [ ] **Step 4: Run the tests to verify they pass.** Expected: PASS.

- [ ] **Step 5: Add the file to the project and commit** "Add fuzzy ranking for the action search".

### Task 4: Insertion with automatic include

**Files:**
- Create: `Cherri/ActionInsertion.swift`
- Modify: `Cherri/CherriCatalog.swift` (add `var insertionText: String` to `CherriAction`, returning `takesParameters ? "\(identifier)(" : "\(identifier)()"`)
- Modify: `Cherri/CherriLanguageService.swift:171` (use `action.insertionText` instead of the inline expression, so autocomplete and search share it)
- Test: `CherriTests/ActionSearchTests.swift`

**Interfaces:**
- Consumes: `CherriActionEntry` (and `CherriActionCategory.includePath`) from Task 1.
- Produces: `struct ActionInsertionResult: Equatable { let text: String; let selection: NSRange }` and `enum ActionInsertion { static func insert(_ entry: CherriActionEntry, into text: String, replacing selection: NSRange) -> ActionInsertionResult }`. Offsets are UTF-16. The resulting selection is an empty range at the end of the inserted action text.

Rules: when `entry.category?.includePath` is non-nil and the text has no `#include\s+['"]<path>['"]` match, insert the line `#include '<path>'` plus a newline at the start of the line after the last existing `#include` line (or at offset 0 when there is none; if the last include line has no trailing newline, add one first). Insert the include first, then shift the selection: include offset at or before `selection.location` shifts the location; at or after the selection's end leaves it; inside the selection grows its length. Then replace the adjusted selection with `entry.action.insertionText`.

- [ ] **Step 1: Write the failing tests:**
  - `testInsertsActionAndIncludeIntoEmptyText`: empty text, caret at 0, a `define` entry in the `text` category (its signature takes parameters) gives the text `#include 'actions/text'\ndefine(` and an empty selection at its end.
  - `testIncludeGoesBelowLastExistingInclude`: text `#include 'actions/device'\n#define color red\n`, caret at the end, a text action → the new include is the second line.
  - `testExistingIncludeIsNotDuplicated`: text already containing `#include "actions/text"` (double quotes) → text gains only the action.
  - `testBasicCategoryAddsNoInclude` and `testUncategorizedActionAddsNoInclude` (`includePath == nil` and `category == nil`).
  - `testSelectionIsReplaced`: selection covering `abc` in `x abc y` is replaced by the action text.
  - `testCaretAboveIncludesIsShiftedCorrectly`: caret at offset 0 with an existing include later in the file leaves the caret location unchanged and the action text lands at offset 0.
  - `testSelectionStraddlingIncludePointKeepsReplacingSameText`: a selection that spans the include insertion offset still replaces exactly the originally selected characters.
  - `testActionWithoutParametersInsertsEmptyParentheses`.

- [ ] **Step 2: Run the tests to verify they fail.** Expected: FAIL.

- [ ] **Step 3: Implement `ActionInsertion.insert` and `CherriAction.insertionText`**, and switch `Candidate.action` to `insertionText`.

- [ ] **Step 4: Run the tests to verify they pass**, and build the app to confirm autocomplete still compiles. Expected: PASS and BUILD SUCCEEDED.

- [ ] **Step 5: Add the file to the project and commit** "Add action insertion with automatic includes".

### Task 5: Search overlay view

**Files:**
- Create: `Cherri/ActionSearchView.swift`
- Modify: `Cherri/CherriLanguageService.swift:209` (change `ActionDocumentation` from `private` to internal so the info popover reuses it)

**Interfaces:**
- Consumes: `CherriActionRegistry.shared.contents()`, `ActionSearchRanker.rank`, `ActionDocumentation`.
- Produces: `struct ActionSearchView: View { init(onInsert: @escaping (CherriActionEntry) -> Void, onDismiss: @escaping () -> Void) }`.

Behavior (spec's builder calls):
- On appear the view loads the registry. While loading it shows a progress indicator. If loading throws, it shows the error's `localizedDescription` in place of the list.
- The panel is a standard `VStack` with `.background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))`, a fixed comfortable width, and the system shadow, placed at the top of the editor.
- A `TextField("Search actions", text:)` with the plain style and a magnifying-glass SF Symbol takes focus on open (`@FocusState`). Beside it, a category `Picker` (menu style, "All" first, in `categories` order). A second `Picker` for the subcategory appears only when the chosen category has subcategories; choosing a different category resets it to "All".
- Results are the entries filtered by the chosen category and subcategory (under "All" every entry, including uncategorized ones), then ranked by `ActionSearchRanker.rank` for the query, shown in a native `List(selection:)`. The list gives arrow-key navigation, selection highlighting and scrolling for free, so there is no hand-written key handling. The first result is selected whenever the results change.
- Each row is a `VStack(alignment: .leading)` with the identifier in `.body.monospaced()` and the one-line description (`summary`, falling back to `title` when the summary is empty) in `.callout` and `.secondary`, plus a borderless `Button` using the `info.circle` SF Symbol with `.help("Show details")`.
- Return inserts the selected entry (`.onSubmit` on the field) and double-clicking a row does the same (`.contextMenu(forSelectionType:menu:primaryAction:)` or an equivalent native double-click action). Escape (`.onExitCommand`) dismisses.
- The info button, and Command-I for the selected row, toggle a native `.popover` containing `ActionDocumentation(action:)` and, when `category?.includePath` is non-nil, a `.callout` line saying `#include 'path'` is needed and is added automatically on insert.
- While loading the view shows a `ProgressView`; if loading throws, it shows `ContentUnavailableView` with the error's `localizedDescription`. An empty result list also shows `ContentUnavailableView.search`.
- Accessibility labels are set on the info button; the native controls cover the rest.

- [ ] **Step 1: Implement `ActionSearchView`** per the behavior above.

- [ ] **Step 2: Add it to a SwiftUI preview** with a few hand-built entries and confirm the layout renders (pickers, rows, popover) in both light and dark appearance.

- [ ] **Step 3: Build and commit** "Add the action search overlay view".

Run: `cd "/Users/brandonjordan/Documents/Xcode Projects/Cherri" && timeout 600 xcodebuild build -project Cherri.xcodeproj -scheme Cherri`
Expected: BUILD SUCCEEDED.

### Task 6: Wire the overlay into the editor

**Files:**
- Modify: `Cherri/ContentView.swift` (state, overlay, insertion, remove the unused `showPopover`)
- Modify: `Cherri/CherriApp.swift` (menu command)

**Interfaces:**
- Consumes: `ActionSearchView`, `ActionInsertion.insert`, `EditorController.currentContentView`.
- Produces: `ContentView.presentActionSearch()`, `EditorController.showActionSearch()`, and a menu item "Search Actions..." with shortcut Command-Shift-A in `CommandGroup(after: .textEditing)`, disabled when `editorController.currentContentView == nil` (the same pattern as the Build commands).

- [ ] **Step 1: Implement the wiring.** Add `@State private var isActionSearchPresented = false` to `ContentView`. When true, overlay `ActionSearchView` at the top of the `VStack` over a dimmed background that dismisses on click. `onInsert` calls `ActionInsertion.insert(entry, into: document.text, replacing: editPosition.selections.first ?? NSRange(location: document.text.utf16.count, length: 0))`, assigns `document.text` and `editPosition.selections`, sets `editorIsFocused = true`, and closes the overlay. `onDismiss` closes it and refocuses the editor. Add the menu command in `CherriApp.swift`.

- [ ] **Step 2: Build**

Run: `cd "/Users/brandonjordan/Documents/Xcode Projects/Cherri" && timeout 600 xcodebuild build -project Cherri.xcodeproj -scheme Cherri`
Expected: BUILD SUCCEEDED.

- [ ] **Step 3: Verify in the running app** (launch the built app by its path or from Xcode; do not kill instances by name). Check each of these and report what you saw:
  - Command-Shift-A opens the overlay with the search field focused; Escape closes it and the editor regains focus.
  - Typing `gpdf` lists `getPDFText`; typing `disk image` lists `makeDiskImage`; the category picker filters the list and a category with subcategories shows the subcategory picker.
  - Return inserts `getPDFText(` and `#include 'actions/pdf'` (or the correct category) at the top; inserting a second action from the same category adds no second include; a `basic` action and `rawAction` add no include.
  - The (i) button and Command-I show the full signature, notes and the include note.
  - Inserted text can be undone with Command-Z. If undo does not restore the earlier text, report it before committing, because that decides whether insertion must go through the text view instead of the document binding.
  - Autocomplete still behaves as before.

- [ ] **Step 4: Commit** "Open the action search from the editor with a menu command".
