# Project window design

## Intent

Cherri today is a document app: every `.cherri` file is its own window. That fits small, single-file shortcuts and should stay exactly as it is.

Larger Cherri work is made of several files that pull each other in with `#include`, often organized into folders, with a `packages` folder alongside. Those projects need IDE-style management of a whole folder: a file tree, multiple files open in tabs, and a main file that is the entry point for the build.

The goal is to add that project experience without changing the single-file experience.

## Goals

- Open a folder as a project. The folder is the project; there is no project file, because a project file could get lost or corrupted.
- Show the folder's contents in a tree: subfolders (used to organize Cherri files), Cherri files, and other assets.
- Open several Cherri files at once in tabs inside the project window. The tab strip is always visible.
- Let the user set a main file for the project. It is the entry point for the main build.
- Build either the main file or the file currently open, from one Build control.
- When a build error comes from a file other than the one on screen, switch to that file.
- Create new Cherri files from the tree and from a new tab.
- Keep opening a single `.cherri` file working as it does today, except that single-file windows show the tab bar by default and new files open in a new tab by default.

## Non-goals

- A project file or any project metadata written into the user's folder.
- Editing non-Cherri assets in the app.
- Forcing includes to resolve from the project root when building the current file.
- Jumping to the error line when switching to the file with the error. Only switching to the file is wanted.

## Anti-goal

A build error in an included file that leaves the user looking at a different file. Switching to the file with the error is the one thing the user said would be wrong to miss.

## Decisions made with the user

### Opening and storage

- A project is opened by opening a folder.
- The main file choice lives in the app's configuration on each machine, keyed by the project folder. Nothing is written into the folder. A folder opened on another machine starts with no main file set.
- The app is not sandboxed (`Cherri.entitlements` is empty), so reading a project folder needs no security-scoped bookmarks.

### Window layout

- A folder tree on the left, a tab strip across the top of the editor, the editor below.
- A star marks the main file, in the tree and on its tab.
- The tab strip is drawn inside the project window, not macOS native window tabs. Native tabs are separate windows, which would mean one tree per tab. Single-file windows keep the native tabs.
- Single-file windows show the native tab bar by default, and files open in a new tab by default. The user wants this as a default, and is fine keeping the built-in tab bar functionality, including its per-app "Show Tab Bar" behavior. Today the code sets nothing for tabs; behavior comes from the system's "Prefer tabs" setting. How to make these the app's defaults has not been verified and is for the builder to confirm against AppKit's window tabbing APIs.

### Opening a file that is inside an open project

- If a project is open and the user opens a `.cherri` file that lives inside that project's folder (Finder, Open Recent), it should open as a tab in the project window.
- If routing it into the project window turns out to be hard, opening it as a separate single-file window is acceptable. The user said the single-file window is logical in that case. The builder decides based on effort, and notes which was chosen.
- A file outside the open project's folder opens as a single-file window as usual.

### Tree contents

- Subfolders are shown with their Cherri files and other assets.
- Double-clicking a non-Cherri asset opens it in its default app. Right-click offers "Reveal in Finder". These assets matter for reference, for example files used with `embedFile()`.
- Right-clicking a folder offers creating a new file in it.
- A new tab behaves as it does today: the user is asked where to save when saving, and the save dialog starts in the project's folder.

### Build

- One Build button with a menu that chooses the target: Main or Current file.
- Current file is meant for building include files on their own, as isolated builds apart from the main build.
- Build main runs the compiler from the main file's folder. Build current file runs it from that file's own folder. This matches how the compiler works today and is deliberate:
  - Plain include paths (`#include 'shared/helpers.cherri'`) resolve relative to the folder of the file being built (the entry file), not relative to the file containing the `#include` (`includes.go:133-134`, `main.go:235` in `~/cherri`).
  - Paths containing `..` are not given that prefix and resolve against the compiler's working directory (`includes.go:133`).
  - Packages (`info.plist` and `./packages/`) are read from the working directory (`packages.go:407`).
- A helper file that only makes sense when included from main will show include errors if built on its own. That is accepted.

### Build errors

- If the error comes from a file other than the open one, switch to that file's tab, opening it if it isn't open. Do not jump to the line.
- The compiler currently omits the filename in `--no-ansi` mode, which the app uses: `Error: message (line:col)` (`parser.go:2142-2143`). The filename only appears in the colored output.
- Change the compiler: in `--no-ansi` mode, include the filename only when the error comes from an include. When it does not, leave the message as it is today, since it can be assumed to be the file being built, like the single-document view. The compiler already knows the origin (`delinquentFile()` in `includes.go`, where an empty origin file means the main file). Warnings use the same function (`parserWarning`) and are a decision for the builder.
- This compiler change is a separate, small change in the `~/cherri` repo and should be its own commit there.

### Compiler binary

- The app bundles `Cherri/cherri_binary`, which is already in `.gitignore`. A newer binary built from `~/cherri` `main` is needed for the include error reporting. Build it locally and do not commit it.

## Where this lands in the existing app

Found by reading the code, for orientation:

- The app is a SwiftUI `DocumentGroup` with a `FileDocument` (`CherriDocument`), and `ContentView` as the editor (`CherriApp.swift:57-59`).
- There is no existing tab, sidebar, folder-opening, file-watching or save-panel code. Settings use `@AppStorage` keys such as `Cherri.theme`.
- Building goes through `ContentView.compileFile()` and `buildShortcut(fileURL:)`, which run `cherri_binary` with `--no-ansi --debug` in the file's folder. Errors are handled in `handleCompilerOutput`, which drives the error banner.
- The app already adds `#include` lines itself (`ActionInsertion.swift`), always as part of single-file editing.

## Calls made by the writer, not by the user

These were not decided in conversation. Check them while reading.

- Without a main file set, the Build menu offers only the current file.
- A packages folder is shown as an ordinary folder in the tree.
- "New file" from the tree creates a Cherri file.
- The project is entered through a folder-opening command, with the exact menu and entry points left to the builder.
- The project window is a separate scene, not a `DocumentGroup` document. Each tab reuses the existing editor view, refactored out of `ContentView` as needed, with per-file text and state held in a project model.
- Build saves all unsaved tabs first, because the compiler reads the main file and its includes from disk. This extends what the app already does today, where `compileFile()` saves the document before building.
- The filename in the compiler's `--no-ansi` error is resolved against the build's working directory. If the app can't open the named file (missing, outside the project), it shows the error banner with that filename and does not silently stay on the current tab. Error files under `packages/` open as ordinary tabs.
- The app is built against the compiler binary it bundles. There is no version detection. The compiler change is committed in `~/cherri` first, then the binary is rebuilt, then the app change is made.
- There is one error banner and one preview for the whole project window, showing the most recent build, regardless of which tab is on screen.
- The main file is set and cleared from the right-click menu of a file in the tree ("Set as main file" and "Clear main file"). If the main file is renamed or deleted, the project is treated as having no main file.
- File watching, hidden files, restoring open tabs on relaunch and Open Recent for projects are left to the builder.

## Left to the builder

- How the project window is built in SwiftUI alongside the existing `DocumentGroup`, and how open tabs and their editor state are modeled.
- How the project opens (menu command, drag and drop, reopening recent projects).
- Handling of unsaved changes, files changed on disk, and renamed or deleted files while open.
- How the existing compile error banner and preview pane work in a project window with several tabs.
- The exact `--no-ansi` format for the filename in the compiler, as long as the app can parse it reliably and the no-include format is unchanged.
