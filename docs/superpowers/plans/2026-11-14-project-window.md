# Project window implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the Cherri app open a folder as a project window with a file tree, an in-window tab strip, a per-machine main file and a Build menu (Main or Current file) that switches to the file a build error came from, while single-file windows keep working as today with the native tab bar shown by default.

**Architecture:** The compiler gains one extra `File: <path>` line in `--no-ansi` errors that come from an include. In the app, the build pipeline and output parsing move out of `ContentView` into `ShortcutBuild` and `CompilerOutputParser`, and the editor and error banner become reusable views. A new `WindowGroup(for: URL.self)` scene hosts `ProjectWindow`, backed by a `@MainActor` `ProjectModel` that owns the tree, the tabs and their text; the main file lives in `UserDefaults` keyed by folder path.

**Tech Stack:** Go (compiler in `~/cherri`), Swift 5, SwiftUI and AppKit (macOS 14 deployment target), CodeEditorView, XCTest, the bundled `cherri_binary`.

**Spec:** `docs/superpowers/specs/2026-11-14-project-window-design.md`

## Global Constraints

- No project file and nothing written into the user's folder except Cherri files the user creates. The main file choice is stored per machine in the app's configuration, keyed by the project folder.
- The project tab strip is drawn inside the project window, not native window tabs. Single-file windows keep native tabs.
- Build main runs the compiler from the main file's folder; Build current file runs it from that file's own folder. Arguments stay `[<entry file path>, "--no-ansi", "--debug"]` plus `--share=anyone` when set.
- On a build error from another file, switch to that file's tab (opening it if needed). Never move the caret to the error line.
- In `--no-ansi` mode, a compiler error that does not come from an include prints exactly as today: `Error: <message> (<line>:<col>)`.
- The compiler change is its own commit in `~/cherri`, made before any app change. `Cherri/cherri_binary` is rebuilt locally and never committed (it is in `.gitignore`).
- The app is not sandboxed (`Cherri.entitlements` is empty). No security-scoped bookmarks.
- Errors are raised and shown, never swallowed. No fallbacks that hide errors.
- Testing follows the repo: `CherriTests` runs the real bundled compiler and real files (see `ActionSearchRegistryTests`). Add tests only where a task names them; UI behavior is verified by running the app. `CherriUITests` holds only Xcode template stubs and is not extended.
- `Cherri.xcodeproj` uses objectVersion 56: each new Swift file needs a `PBXBuildFile`, a `PBXFileReference`, a group child entry and a `PBXSourcesBuildPhase` entry in `project.pbxproj` (test files go in the `CherriTests` target's phase). All new app files go flat in `Cherri/`.
- Every Xcode build runs `build_complier.sh` (shell phase `7283584A2D5EBB28007F02AD`, `alwaysOutOfDate = 1`), which rebuilds `Cherri/cherri_binary` from the `Cherri/Compiler` submodule. Task 2 handles this.
- The app repo is in iCloud-synced Documents: wrap `git` and `xcodebuild` in `timeout`, use `cd <path> && git ...`, never install anything in-tree. Never kill the app by name (`pkill Cherri`); kill test instances by PID only.
- Strict typing, small single-purpose functions, early returns, comments only for why. Files end with a newline. No em dashes in code, comments or commit messages.
- One commit per task, imperative message, ending with the session's `Co-Authored-By` trailer.

## Review Focus

- An error in an include that sits in a subfolder of a project whose path contains a space (`My Project/shared/helper.cherri`): the build reports that file and the window switches to it (Task 3 and Task 9 tests).
- An include written with `..` (`#include '../shared/helper.cherri'`) built as Current file from a subfolder: the reported path is resolved against the build's working directory and still names the right file (Task 3 test).
- The error file is missing or outside the project folder: the banner shows the filename and the selected tab does not change (Task 9 test).
- The main file is renamed or deleted after being set: the project has no main file and the Build menu offers only Current file (Task 6 test).
- Pressing Command-B with a project window focused while single-file windows are open: the project window builds, not whichever single-file window appeared last, which is what `EditorController.currentContentView` does today (Task 9 verification).

## Open questions

- The submodule pointer: Task 2 checks out the Task 1 commit in `Cherri/Compiler` so the Xcode build phase stops overwriting the new binary. Whether to commit that pointer change in the app repo is the owner's call; the spec only says not to commit the binary.
- Command-S for untitled project tabs: SwiftUI's `DocumentGroup` owns File > Save, and routing it to a non-document window is unverified. Task 8 saves untitled tabs from the tab's context menu and on close instead.
- Closing the whole project window with an untitled tab that has text loses that text; intercepting a SwiftUI window close is not covered here.

---

### Task 1: Name the included file in `--no-ansi` errors (compiler)

**Files:**
- Modify: `/Users/brandonjordan/cherri/parser.go:2138-2145` (`parserError`)
- Create: `/Users/brandonjordan/cherri/tests/include-errors/main.cherri`, `/Users/brandonjordan/cherri/tests/include-errors/main-error.cherri`, `/Users/brandonjordan/cherri/tests/include-errors/shared/helper.cherri`
- Test: `/Users/brandonjordan/cherri/cherri_test.go`

**Interfaces:**
- Produces (output format the app parses in Task 3): when the error's origin is an included file, `--no-ansi` prints
  ```
  Error: <message> (<line>:<col>)
  File: <path>
  ```
  where `<path>` is the include path as the compiler resolved it (`relativePath + includePath` for plain paths, as written for `..` paths, `includes.go:133-134`). Otherwise the output is unchanged.
- Produces: `func noAnsiErrorReport(message string, errorFilename string, errorLine int, errorCol int) string` in `parser.go`. The origin is an include when `errorFilename != filePath` (`delinquentFile()` returns `filePath` for the main file and for generated lines).

Builder's calls, noted: the format is a second `File: ` line so the first line stays byte-identical and a path with spaces, colons or parentheses needs no escaping. Warnings (`parserWarning`) are left unchanged, since the spec only switches files for errors.

Fixtures live in `tests/include-errors/` because `TestCherri` compiles every `.cherri` file directly in `tests/` and expects it to succeed; it does not recurse.
- `main.cherri`: line 1 `#include 'shared/helper.cherri'`, line 2 `alert("main")`.
- `shared/helper.cherri`: line 1 a comment, line 2 `#include "nope.cherri"` (double quotes hit `parserError("Use raw string (') for include file paths")`, `includes.go:107`).
- `main-error.cherri`: line 1 `#include "nope.cherri"`.

- [ ] **Step 1: Write the failing tests** in `cherri_test.go`. `parserError` calls `os.Exit(1)`, so each test re-runs the test binary as a subprocess.
  - `func compileInSubprocess(t *testing.T, file string) string`: runs `os.Args[0]` with `-test.run=^TestCompileSubprocess$` and env `CHERRI_SUBPROCESS_FILE=<file>`, returns combined output (a non-zero exit is expected, not a failure).
  - `TestCompileSubprocess`: skips when `CHERRI_SUBPROCESS_FILE` is empty; otherwise sets `args.Args["no-ansi"]`, `args.Args["skip-sign"]`, `os.Args[1] = file`, calls `loadStandardActions()` and `main()`.
  - `TestNoAnsiIncludeErrorNamesTheIncludedFile`: output for `tests/include-errors/main.cherri` contains `Error: Use raw string (') for include file paths (2:` and the line `File: tests/include-errors/shared/helper.cherri`, and the `File:` line directly follows the `Error:` line.
  - `TestNoAnsiMainFileErrorOmitsTheFile`: output for `tests/include-errors/main-error.cherri` contains `Error: Use raw string (') for include file paths (1:` and no line starting with `File:`.

- [ ] **Step 2: Run the tests to verify the include test fails**

Run: `cd /Users/brandonjordan/cherri && go test -run 'TestNoAnsi' -v`
Expected: `TestNoAnsiIncludeErrorNamesTheIncludedFile` FAILS (no `File:` line); `TestNoAnsiMainFileErrorOmitsTheFile` already passes (it guards the unchanged format).

- [ ] **Step 3: Implement `noAnsiErrorReport` and use it in `parserError`'s `no-ansi` branch** (`fmt.Print` the report, then `os.Exit(1)` as today).

- [ ] **Step 4: Run the tests to verify they pass** (same command). Expected: both PASS. Then `go vet ./...` with no new findings.

- [ ] **Step 5: Commit in `~/cherri`**

```bash
cd /Users/brandonjordan/cherri && git add parser.go cherri_test.go tests/include-errors && git commit -m "Name the included file in no-ansi errors"
```

### Task 2: Rebuild the bundled compiler binary (local only)

**Files:**
- Local only, never committed: `Cherri/cherri_binary`, the `Cherri/Compiler` submodule checkout.

The Xcode build phase rebuilds `cherri_binary` from `Cherri/Compiler` on every build (`build_complier.sh`), so a binary copied in from `~/cherri` is overwritten on the next build. The submodule checkout has to contain the Task 1 commit.

- [ ] **Step 1: Check out the Task 1 commit in the submodule working tree**

```bash
cd "/Users/brandonjordan/Documents/Xcode Projects/Cherri/Cherri/Compiler" && timeout 120 git fetch /Users/brandonjordan/cherri main && timeout 60 git checkout FETCH_HEAD
```
Expected: the submodule HEAD is the Task 1 commit. Do not commit the changed submodule pointer in the app repo; leave it for the owner (see Open questions).

- [ ] **Step 2: Build the binary** with `cd "/Users/brandonjordan/Documents/Xcode Projects/Cherri" && ./build_complier.sh`. Expected: `Cherri/cherri_binary` has a new modification time.

- [ ] **Step 3: Verify the format** by running `Cherri/cherri_binary /Users/brandonjordan/cherri/tests/include-errors/main.cherri --no-ansi --debug` from `/Users/brandonjordan/cherri`. Expected: the `Error:` line followed by `File: /Users/brandonjordan/cherri/tests/include-errors/shared/helper.cherri` (absolute, because the entry path was absolute). `timeout 30 git status --short` in the app repo shows no `cherri_binary` entry.

No commit.

### Task 3: Move the build pipeline and output parsing out of `ContentView`

**Files:**
- Create: `Cherri/CompilerOutputParser.swift`, `Cherri/ShortcutBuild.swift`
- Modify: `Cherri/ContentView.swift:265-374` (`parseFilepath`, `compileFile`, `signedShortcutFileURL`, `buildShortcut`), `:376-407` (`handleCompilerOutput`), `:452-467` (`BuildError` moves to `ShortcutBuild.swift`)
- Test: `CherriTests/ShortcutBuildTests.swift`

**Interfaces:**
- Produces:
  - `struct CompilerReport: Equatable { let hasError: Bool; let errorMessage: String?; let errorFilePath: String?; let warningMessages: [String] }`. `errorMessage` keeps the trailing `(line:col)` exactly as `handleCompilerOutput` extracts it today; `errorFilePath` is the raw `File:` line value; `warningMessages` includes the native signing fallback message.
  - `enum CompilerOutputParser { static func report(from output: String) -> CompilerReport }`, using today's regexes from `handleCompilerOutput` plus `/\(\d+:\d+\)\nFile: (?<path>[^\n]+)\n/` read right after the located error.
  - `struct ShortcutPreview: Equatable { let plist: String; let workflowName: String }`
  - `struct ShortcutBuildResult { let report: CompilerReport; let errorFileURL: URL?; let preview: ShortcutPreview?; let signedShortcutURL: URL }`. `errorFileURL` is `errorFilePath` resolved with `URL(fileURLWithPath:relativeTo: workingDirectory).standardizedFileURL`, `nil` when there is no `File:` line.
  - `enum ShortcutBuild { static func run(entryFileURL: URL, sourceText: String, shareWith: ShareOption) async throws -> ShortcutBuildResult }`. Working directory is `entryFileURL.deletingLastPathComponent()`. Keeps today's behavior: processed-source and plist cleanup, `#define name` naming, returning early with no preview when the report has an error, throwing `BuildError.compilerExited` on a non-zero status without an error, `.plistMissing`, `.compilerMissing`.
- `ContentView.compileFile()` keeps saving through `NSDocumentController` first, then calls `ShortcutBuild.run`, then maps the report onto its existing `@State` (`hasError`, `hasWarnings`, `missingIncludePath`, `messages` via `createMessage`, `compiled`, `hasPreview`, `previewController.show`). Single-file behavior does not change.

- [ ] **Step 1: Write the failing tests** in `CherriTests/ShortcutBuildTests.swift`. Each test writes a temp project at `FileManager.default.temporaryDirectory/<UUID>/My Project/` (note the space) and removes it in `tearDown`. They run the bundled compiler, like `ActionSearchRegistryTests`. Compare URLs with `.resolvingSymlinksInPath()` (the temp folder is under a `/var` symlink).
  - `testIncludeErrorReportsTheIncludedFile`: `main.cherri` = `#include 'shared/helper.cherri'\nalert("main")\n`, `shared/helper.cherri` = `// helper\n#include "nope.cherri"\n`. `ShortcutBuild.run(entryFileURL: main, ...)` gives `report.hasError == true`, `errorFileURL == shared/helper.cherri`, `preview == nil`, and `report.errorMessage` starting with `Use raw string (') for include file paths (2:`.
  - `testMainFileErrorHasNoErrorFile`: `main.cherri` = `#include "nope.cherri"\n` gives `hasError == true`, `errorFilePath == nil`, `errorFileURL == nil`.
  - `testParentRelativeIncludeResolvesAgainstTheBuildFolder`: `sub/entry.cherri` = `#include '../shared/helper.cherri'\n` with the same helper; building `sub/entry.cherri` gives `errorFileURL == shared/helper.cherri`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd "/Users/brandonjordan/Documents/Xcode Projects/Cherri" && timeout 600 xcodebuild test -project Cherri.xcodeproj -scheme Cherri -only-testing:CherriTests/ShortcutBuildTests`
Expected: FAIL (types not defined).

- [ ] **Step 3: Implement `CompilerOutputParser` and `ShortcutBuild`, and switch `ContentView` to them.** Remove `parseFilepath`, `buildShortcut`, `handleCompilerOutput` and the `fileName`/`shortcutName`/`path`/`shortcutURL` state that only fed them; the Compiled button and Export use `signedShortcutURL` from the last result.

- [ ] **Step 4: Run the tests to verify they pass** (same command), then the full `CherriTests` suite (drop `-only-testing`). Expected: PASS.

- [ ] **Step 5: Verify single-file behavior in the app.** Open a `.cherri` file, build a valid one (Compiled, preview shows, Reveal in Finder and Export work), build one with an error (banner and inline message), build one missing an include (Fix button adds it and rebuilds). Expected: identical to before.

- [ ] **Step 6: Add the files to the project and commit** "Move the Shortcut build and compiler output parsing out of the editor view".

### Task 4: Extract the editor and error banner views

**Files:**
- Create: `Cherri/CherriEditorPane.swift`, `Cherri/CompileErrorBanner.swift`
- Modify: `Cherri/ContentView.swift:60-76` (body editor stack), `:153-220` (banner, `missingIncludeFix`, `missingIncludeFixButton`)

**Interfaces:**
- Produces:
  - `struct CherriEditorPane: View { init(text: Binding<String>, position: Binding<CodeEditor.Position>, messages: Binding<Set<TextLocated<Message>>>, isFocused: FocusState<Bool>.Binding) }`. Owns its own `@StateObject CherriLanguageService` (the service holds one document's text, so each editor needs its own) and reads `Cherri.theme`, `Cherri.showMinimap`, `Cherri.wrapText` from `@AppStorage`.
  - `struct CompileErrorBanner: View { init(missingIncludePath: String?, errorFileName: String?, isBusy: Bool, onFix: @escaping (String) -> Void) }`. `errorFileName` is `nil` in single-file windows; Task 9 uses it. When set, the banner reads `Unable to compile Shortcut.` followed by `Error in <errorFileName>` on the same single line, truncating the filename first. The existing one-line and `ViewThatFits` behavior and the existing comments stay.

- [ ] **Step 1: Move the code** into the two views and use them from `ContentView` (`CompileErrorBanner(missingIncludePath:errorFileName: nil, isBusy: busy, onFix: addMissingInclude)`).
- [ ] **Step 2: Build and run the full `CherriTests` suite.** Expected: BUILD SUCCEEDED, tests PASS.
- [ ] **Step 3: Verify in the app** that the editor, minimap and wrap settings, completions, error banner, Fix button and banner width behavior in a narrow window look and work as before.
- [ ] **Step 4: Add the files to the project and commit** "Extract the editor and compile error banner into reusable views".

### Task 5: Load a project folder tree

**Files:**
- Create: `Cherri/ProjectTree.swift`
- Test: `CherriTests/ProjectWindowTests.swift`

**Interfaces:**
- Produces:
  - `struct ProjectNode: Identifiable, Hashable { enum Kind: Hashable { case folder, cherriFile, asset }; let url: URL; let kind: Kind; let children: [ProjectNode]?; var id: URL { url } }`. `children` is `nil` for files (the shape `List(_:children:)` needs).
  - `enum ProjectTree { static func load(folder: URL) throws -> ProjectNode }` returns the root folder node, read recursively with `FileManager.contentsOfDirectory(at:includingPropertiesForKeys: [.isDirectoryKey], options: .skipsHiddenFiles)`. Read errors are thrown.

Builder's calls, noted: hidden files are skipped; `packages` is an ordinary folder; folders sort before files, each by `localizedStandardCompare` on the name; a file is `.cherriFile` when its extension is `cherri`, otherwise `.asset`.

- [ ] **Step 1: Write the failing test** in class `ProjectTreeTests`, `testTreeListsFoldersCherriFilesAndAssets`: a temp folder with `main.cherri`, `icon.png`, `.hidden`, `shared/helper.cherri`, `packages/@a/b/main.cherri`. The root's children are, in order, `packages` (folder), `shared` (folder), `icon.png` (asset), `main.cherri` (cherriFile); `.hidden` is absent; `shared`'s only child is `helper.cherri` as `cherriFile`.
- [ ] **Step 2: Run it to verify it fails** (`-only-testing:CherriTests/ProjectTreeTests`). Expected: FAIL.
- [ ] **Step 3: Implement `ProjectTree.load`.**
- [ ] **Step 4: Run it to verify it passes.** Expected: PASS.
- [ ] **Step 5: Add the files to the project and commit** "Load a project folder into a file tree".

### Task 6: Store the main file per project folder

**Files:**
- Create: `Cherri/ProjectMainFileStore.swift`
- Test: `CherriTests/ProjectWindowTests.swift`

**Interfaces:**
- Produces: `struct ProjectMainFileStore { init(defaults: UserDefaults = .standard); func mainFile(in folder: URL) -> URL?; func setMainFile(_ file: URL, in folder: URL); func clearMainFile(in folder: URL) }`. Stored under the key `Cherri.projectMainFiles` as `[String: String]`: the folder's standardized path to the main file's path relative to the folder. `mainFile(in:)` returns `nil` when nothing is stored or the stored file no longer exists.

- [ ] **Step 1: Write the failing tests** (class `ProjectMainFileStoreTests`, using `UserDefaults(suiteName: "CherriTests.\(UUID())")` and removing the suite in `tearDown`):
  - `testMainFileIsRememberedPerFolder`: set `shared/main.cherri` in folder A; `mainFile(in: A)` is that URL and `mainFile(in: B)` is `nil`.
  - `testRenamedMainFileMeansNoMainFile`: set `main.cherri`, then rename it on disk to `app.cherri`; `mainFile(in:)` is `nil`.
  - `testClearedMainFileIsGone`: set, clear, `mainFile(in:)` is `nil`.
- [ ] **Step 2: Run to verify they fail.** Expected: FAIL.
- [ ] **Step 3: Implement `ProjectMainFileStore`.**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS.
- [ ] **Step 5: Add the files to the project and commit** "Remember each project's main file in the app settings".

### Task 7: Project window with the folder tree

**Files:**
- Create: `Cherri/ProjectModel.swift`, `Cherri/ProjectWindow.swift`, `Cherri/ProjectTreeView.swift`, `Cherri/OpenFolderCommands.swift`
- Modify: `Cherri/CherriApp.swift:58-98` (add the scene and commands)

**Interfaces:**
- Consumes: `ProjectTree.load(folder:)`, `ProjectNode` (Task 5); `ProjectMainFileStore` (Task 6).
- Produces:
  - `enum ProjectWindowScene { static let id = "project" }` and in `CherriApp.body`: `WindowGroup("Project", id: ProjectWindowScene.id, for: URL.self) { $folderURL in ProjectWindow(folderURL: folderURL) }`. Opening the same folder again brings its window forward (SwiftUI's behavior for a value-based `WindowGroup`).
  - `struct OpenFolderCommands: Commands`: `CommandGroup(after: .newItem)` with `Button("Open Folder...")`, shortcut Option-Command-O, showing an `NSOpenPanel` (`canChooseDirectories = true`, `canChooseFiles = false`, `allowsMultipleSelection = false`) and calling `openWindow(id: ProjectWindowScene.id, value: url)`.
  - `@MainActor final class ProjectModel: ObservableObject { let folderURL: URL; @Published private(set) var tree: ProjectNode?; @Published private(set) var mainFileURL: URL?; @Published var errorMessage: String?; init(folderURL: URL, mainFileStore: ProjectMainFileStore = ProjectMainFileStore()); func reload(); func setMainFile(_ fileURL: URL); func clearMainFile() }`. `reload()` reloads the tree and main file and puts any thrown error in `errorMessage`, shown as an alert.
  - `struct ProjectTreeView: View { @ObservedObject var model: ProjectModel; let onOpenCherriFile: (URL) -> Void; let onNewFile: (URL) -> Void }` (the closures are wired up in Task 8).

Builder's calls, noted: the project opens from File > Open Folder... only (no drag and drop, no Open Recent for projects; SwiftUI window restoration may reopen project windows on relaunch, tabs are not restored). The project window sets its `NSWindow.tabbingMode` to `.disallowed` so it never joins single-file native tab groups. There is no file watching: the tree and main file reload when the window becomes key and after the app creates a file. A `.cherri` file opened from Finder or Open Recent while its project is open opens as a single-file window (the spec's accepted fallback; routing it into the project window would mean taking over `DocumentGroup`'s `NSDocumentController` open path).

Tree behavior (`List(selection:)` over `[tree]` with `children: \.children`, using `contextMenu(forSelectionType:menu:primaryAction:)`):
- The root folder is the first row, so top-level files can be created.
- Primary action (double-click or Return): Cherri file calls `onOpenCherriFile`; asset calls `NSWorkspace.shared.open(url)`; folder does nothing.
- Context menu: Cherri file offers "Set as Main File" or, on the main file, "Clear Main File"; asset offers "Reveal in Finder" (`NSWorkspace.shared.activateFileViewerSelecting([url])`); folder offers "New File..." (`onNewFile(url)`).
- The main file row shows a `star.fill` SF Symbol after its name.

Window layout: `NavigationSplitView { ProjectTreeView } detail: { ... }`, title `folderURL.lastPathComponent`. The detail is a placeholder in this task and becomes the tabs and editor in Task 8.

- [ ] **Step 1: Implement the model, scene, command and tree view.**
- [ ] **Step 2: Build and run the full `CherriTests` suite.** Expected: BUILD SUCCEEDED, PASS.
- [ ] **Step 3: Verify in the app** with a folder holding `main.cherri`, `shared/helper.cherri`, `packages/`, an image and a hidden file: File > Open Folder... opens one project window; the tree shows folders, files and the image, no hidden file; double-clicking the image opens Preview; right-click > Reveal in Finder selects it; Set as Main File stars the row and survives closing and reopening the folder; renaming that file in Finder and refocusing the window removes the star; opening the same folder again focuses the existing window; single-file windows still open and build as before.
- [ ] **Step 4: Add the files to the project and commit** "Open a folder as a project window with a file tree".

### Task 8: Tabs, saving and new files in the project window

**Files:**
- Create: `Cherri/ProjectTabStrip.swift`
- Modify: `Cherri/ProjectModel.swift`, `Cherri/ProjectWindow.swift`, `Cherri/ProjectTreeView.swift`
- Test: `CherriTests/ProjectWindowTests.swift`

**Interfaces:**
- Consumes: `CherriEditorPane`, `CompileErrorBanner` (Task 4); `ProjectModel`, `ProjectTreeView` (Task 7).
- Produces (additions to `ProjectModel`):
  - `struct ProjectTab: Identifiable { let id: UUID; var fileURL: URL?; var text: String; var hasUnsavedChanges: Bool; var messages: Set<TextLocated<Message>>; var editPosition: CodeEditor.Position }` (`fileURL == nil` is an untitled tab).
  - `@Published private(set) var tabs: [ProjectTab]`, `@Published var selectedTabID: ProjectTab.ID?`, `var selectedTab: ProjectTab? { get }`
  - `func open(_ fileURL: URL) throws` (selects the existing tab for that file, else reads it as UTF-8 and appends a tab), `func newTab()`, `func close(_ tabID: ProjectTab.ID)`, `func updateText(_ text: String, in tabID: ProjectTab.ID)`, `func save(_ tabID: ProjectTab.ID) throws` (writes a titled tab; untitled tabs are saved through `saveAs`), `func saveAs(_ tabID: ProjectTab.ID, to fileURL: URL) throws`, `func saveAllTitledTabs() throws`, `func createCherriFile(named name: String, in folder: URL) throws -> URL`.
  - `enum ProjectFileError: LocalizedError { case fileExists(String); case unreadable(String) }`

Builder's calls, noted:
- Titled tabs autosave 1 second after the last edit, like `DocumentGroup` documents autosave today, and also on close and before a build, so there are no unsaved-changes prompts for them.
- An untitled tab saves through `NSSavePanel` (`directoryURL = folderURL`, `allowedContentTypes = [.cherriSource]`, name `Untitled.cherri`), opened from the tab's context menu "Save..." and when closing an untitled tab with text (Save, Don't Save, Cancel). Command-S is not wired for the project window (see Open questions).
- "New File..." on a folder asks for a name in an alert with a text field (default `Untitled`), appends `.cherri` when missing, refuses an existing name with `ProjectFileError.fileExists` shown in the alert, creates an empty file, reloads the tree and opens it in a tab.
- Files changed on disk while open are not reloaded. A save error is shown as an alert.

Tab strip (`ProjectTabStrip`): always visible, a horizontal `ScrollView` of tab buttons with the file name (or `Untitled`), a `star.fill` on the main file's tab, a close button per tab, and a trailing `plus` button calling `newTab()`. The detail column is `ProjectTabStrip`, then the banner (Task 9), then `CherriEditorPane` for the selected tab with `.id(tab.id)` so each tab gets its own language service.

- [ ] **Step 1: Write the failing tests** (class `ProjectModelTests`, `@MainActor`, temp project folder as in Task 3):
  - `testOpeningAnOpenFileSelectsItsTab`: `open(main)`, `open(helper)`, `open(main)` leaves two tabs with `main` selected.
  - `testCreatedFileOpensInATab`: `createCherriFile(named: "tools", in: shared)` returns `shared/tools.cherri`, which exists and is the selected tab; calling it again throws `ProjectFileError.fileExists`.
  - `testSaveAllWritesEditedTabs`: `updateText("alert(\"edited\")", in:)` on an open tab, `saveAllTitledTabs()`, then the file on disk has that text and `hasUnsavedChanges` is false.
- [ ] **Step 2: Run to verify they fail** (`-only-testing:CherriTests/ProjectModelTests`). Expected: FAIL.
- [ ] **Step 3: Implement the model additions, tab strip, editor wiring, autosave, save panel and New File alert.**
- [ ] **Step 4: Run to verify they pass**, then the full suite. Expected: PASS.
- [ ] **Step 5: Verify in the app:** open several files from the tree as tabs; the tab strip shows with one tab; switching tabs keeps each tab's text and caret; edits reach disk within about a second; the main file's tab has a star; the plus button makes an untitled tab whose Save... panel starts in the project folder; closing it with text asks first; New File... in a subfolder creates and opens the file.
- [ ] **Step 6: Add the files to the project and commit** "Open project files in tabs and create new files from the tree".

### Task 9: Build from the project window and switch to the error's file

**Files:**
- Create: `Cherri/BuildCommands.swift`
- Modify: `Cherri/ProjectModel.swift`, `Cherri/ProjectWindow.swift`, `Cherri/ContentView.swift:58, 92-108, 136-138`, `Cherri/CherriApp.swift:11-25, 56, 60, 64-75`
- Test: `CherriTests/ProjectWindowTests.swift`

**Interfaces:**
- Consumes: `ShortcutBuild.run(entryFileURL:sourceText:shareWith:)`, `ShortcutBuildResult.errorFileURL` (Task 3); `CompileErrorBanner(errorFileName:)` (Task 4); `ProjectModel.open(_:)`, `saveAllTitledTabs()` (Task 8).
- Produces:
  - `enum BuildTarget: Hashable { case main, currentFile }`
  - On `ProjectModel`: `@Published var buildTarget: BuildTarget`, `var availableBuildTargets: [BuildTarget] { get }` (`[.currentFile]` without a main file, else `[.main, .currentFile]`), `func entryFileURL(for target: BuildTarget) -> URL?` (`nil` for an untitled current tab or a missing main file), and `func showBuildError(in fileURL: URL) -> Bool`, which selects or opens the tab for `fileURL` and returns `true`, or returns `false` with the selection unchanged when the file is missing or not inside `folderURL` (compare with `.resolvingSymlinksInPath()` path prefixes). Files under `packages/` open as ordinary tabs.
  - `struct BuildCommands { let build: () -> Void; let buildAndOpen: () -> Void }` with `FocusedValues.buildCommands: BuildCommands?`, published with `.focusedSceneValue` by both `ContentView` and `ProjectWindow`. The Build menu in `CherriApp` uses it and is disabled when it is `nil`. `EditorController` and its `currentContentView` are removed.

Build flow in `ProjectWindow` (one banner, one preview and one build status for the whole window, showing the most recent build): call `saveAllTitledTabs()`, run `ShortcutBuild.run` with the entry file for `buildTarget` and its saved text, clear every tab's messages, then:
- error with `errorFileURL == nil`: messages go to the entry file's tab;
- error with `errorFileURL` set: `showBuildError(in:)`; on `true` the error message goes to that tab's messages and the caret is not moved; on `false` the banner shows `errorFileName` as the path the compiler printed;
- warnings go to the entry file's tab; the Fix button adds the include to the selected tab and rebuilds.

Toolbar, builder's call noted: the same items as the single-file window, with the Build button as a SwiftUI `Menu` whose primary action builds `buildTarget` and whose content is a `Picker` over `availableBuildTargets` ("Main" and "Current File"). Build is disabled when `entryFileURL(for: buildTarget)` is `nil`. When the main file goes away, `buildTarget` falls back to `.currentFile`.

- [ ] **Step 1: Write the failing tests** in `ProjectModelTests`:
  - `testBuildErrorInAnotherFileSwitchesToIt`: temp `My Project` with the Task 3 `main.cherri` and failing `shared/helper.cherri`; only `main` is open; `showBuildError(in: helper)` returns `true`, the selected tab's `fileURL` is `helper`, two tabs are open, and `main`'s tab is unchanged.
  - `testBuildErrorOutsideTheProjectDoesNotSwitch`: a file in a sibling temp folder returns `false` and the selection stays on `main`.
  - `testMissingBuildErrorFileDoesNotSwitch`: a nonexistent path inside the project returns `false`.
  - `testWithoutAMainFileOnlyCurrentFileCanBeBuilt`: no main set gives `availableBuildTargets == [.currentFile]`; after `setMainFile(main)` it is `[.main, .currentFile]` and `entryFileURL(for: .main) == main`.
- [ ] **Step 2: Run to verify they fail.** Expected: FAIL.
- [ ] **Step 3: Implement the model additions, the Build menu, the build flow and `BuildCommands`**, and switch `ContentView` from `EditorController` to `.focusedSceneValue(\.buildCommands, ...)`.
- [ ] **Step 4: Run to verify they pass**, then the full suite. Expected: PASS.
- [ ] **Step 5: Verify in the app:** with `main.cherri` as main and the error in `shared/helper.cherri`, Build > Main switches to the helper tab (opening it), shows the banner and the inline error, and leaves the caret where it was; Build > Current File on a helper builds from `shared/`; an unsaved edit in another tab is on disk before the compiler runs; with a single-file window also open, Command-B and Command-R act on whichever window is focused; single-file builds behave as before.
- [ ] **Step 6: Add the files to the project and commit** "Build the main or current file from the project window and switch to the file with the error".

### Task 10: Show the tab bar and open new files in tabs for single-file windows

**Files:**
- Create: `Cherri/WindowTabbing.swift`
- Modify: `Cherri/ContentView.swift` (attach the accessor)

**Interfaces:**
- Produces: `struct WindowTabbingAccessor: NSViewRepresentable { let configure: (NSWindow) -> Void }`, calling `configure` once when its view joins a window.

This has to be verified against AppKit's window tabbing APIs before writing code. What is documented: `NSWindow.tabbingMode` (`.automatic`, `.preferred`, `.disallowed`; `.preferred` opens the window as a tab regardless of the system "Prefer tabs" setting), `NSWindow.userTabbingPreference`, `NSWindow.allowsAutomaticWindowTabbing`, `NSWindow.tabbingIdentifier`, `NSWindow.toggleTabBar(_:)` and the read-only `NSWindowTabGroup.isTabBarVisible`. Not verified:
- whether setting `tabbingMode = .preferred` from a view that has just joined the window is early enough for SwiftUI's `DocumentGroup` window to open as a tab, or whether it must be set before the window is shown;
- whether AppKit remembers the "Show Tab Bar" choice per app (its persistence is undocumented), which decides whether showing the bar by default can respect a user who later hides it;
- whether all `DocumentGroup` windows share one `tabbingIdentifier`.

- [ ] **Step 1: Verify the APIs** in a scratch build: set `tabbingMode = .preferred` in the accessor and open three new documents with the system "Prefer tabs" set to "in full screen"; then call `toggleTabBar(nil)` when `tabGroup?.isTabBarVisible == false`, hide the bar from View > Hide Tab Bar, quit, relaunch and check whether the hidden state is kept. Record the results in the task's commit message body. Expected: new documents join the key window's tab group, and the user's Hide Tab Bar choice survives relaunch. If either fails, stop and report to the owner before going on.
- [ ] **Step 2: Implement** `configure` for document windows only (attached in `ContentView`, so the Settings, Import and project windows are untouched): set `tabbingMode = .preferred`, and show the tab bar only on the app's first run (a `Cherri.didShowTabBarByDefault` `@AppStorage` flag) so AppKit's own per-app "Show Tab Bar" state takes over afterwards.
- [ ] **Step 3: Build, run the full suite, and verify in the app:** a fresh launch with a new document shows the tab bar with one tab; File > New opens a new tab in the same window; hiding the tab bar sticks across relaunches; project windows never join the document tab group.
- [ ] **Step 4: Add the file to the project and commit** "Show the tab bar and open new documents in tabs by default".
