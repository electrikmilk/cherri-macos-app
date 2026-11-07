<img width="256" height="256" alt="Cherri App Icon" src="docs/images/app-icon.png" />

# Cherri IDE

IDE for the [Cherri programming language](https://github.com/electrikmilk/cherri).

<img width="1080" alt="Cherri editor with a compiled Shortcut" src="docs/images/editor.png" />

## Features

### Document-based macOS app

Create, edit, save, open, duplicate, rename, etc. Cherri files.

### Build & Run
- 🔨 **Build:** Compile the current Cherri file into a Shortcut.
- ▶️ **Run:** Compile, then open the compiled Shortcut.

### Import from iCloud

Convert an existing Shortcut to Cherri code. Go to **File -> Import Shortcut...** (**⌘I**), paste the Shortcut's iCloud link and click **Import**. The Shortcut is converted and opened as a new Cherri document.

To get the link, go to Shortcuts -> Share Your Shortcut -> Copy iCloud Link.

This feature is in beta.

<img width="560" alt="Import Shortcut window" src="docs/images/importer.png" />

### Inline Errors & Warnings

![Inline compiler error](docs/images/inline-error.png)
![Inline compiler warning](docs/images/inline-warning.png)

### Tabs

Enable the tab bar in the Menubar in **View -> Show Tab Bar**. Click the plus button to create a new Cherri file.

If you open a file and it does not open in a new tab, go to your **System Settings** -> **Desktop & Dock** -> Set **Prefer tabs when opening documents** to _Always_.

![Tab bar with two Cherri files open](docs/images/tabs.png)

### Document Type

This app sets up `.cherri` files as a type of plain text document.

<img width="103" height="104" alt="Screenshot 2025-11-29 at 21 48 19" src="https://github.com/user-attachments/assets/e30d2438-d166-4618-aba1-999de29afde5" />

If you have previews on, it shows the contents of the file.

![Screenshot 2023-12-20 at 20 25 25](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/1f66b438-33cb-49d9-bbaf-fd9011890387)

### Settings

<img width="540" alt="Cherri Settings window" src="docs/images/settings.png" />

## Dependencies

- [CodeEditorView](https://github.com/mchakravarty/CodeEditorView)

## How to run

```bash
git clone --recursive https://github.com/electrikmilk/cherri-macos-app.git Cherri
```

### Requirements

- XCode - Download from the Mac App Store.
- Go - Install from Homebrew or [go.dev](https://go.dev/dl/).

### Run

1. Open `Cherri/Cherri.xcodeproj` in XCode.
2. Click the play icon button to build the project after it has been indexed.

This should "install" the project on your Mac, at least temporarily. But if it disappears due to being an unsigned app, just follow the steps above to re-install.
