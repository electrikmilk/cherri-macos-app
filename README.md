![256](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/6b7c2b24-f471-4c28-8484-7a17ac4886e8)

# Cherri IDE

IDE for the [Cherri programming language](https://github.com/electrikmilk/cherri).

![Screenshot 2023-12-21 at 23 44 29](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/99b290c0-4299-44ad-86a1-7158b319022a)

## Features

### Document-based macOS app

Create, edit, save, open, duplicate, rename, etc. Cherri files.

### Build & Run
- 🔨 **Build:** Compile the current Cherri file into a Shortcut.
- ▶️ **Run:** Compile, then open the compiled Shortcut.

### Inline Errors & Warnings

![Screenshot 2023-12-21 at 23 45 09](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/03a85422-5576-4a24-b93c-351d1431f2f0)
![Screenshot 2023-12-21 at 23 44 58](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/356fafd5-a2a0-461d-a849-6af4e6fbbc2c)

### Tabs

Enable the tab bar in the Menubar in **View -> Show Tab Bar**. Click the plus button to create a new Cherri file.

If you open a file and it does not open in a new tab, go to your **System Settings** -> **Desktop & Dock** -> Set **Prefer tabs when opening documents** to _Always_.

![Screenshot 2023-12-21 at 23 46 21](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/0ebf3d24-1f59-4886-98c8-85d334663da9)

### Document Type

This app sets up `.cherri` files as a type of plain text document.

![Screenshot 2023-12-20 at 20 25 41](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/33f17ae2-7746-4782-b5f1-53f35b65a895)

If you have previews on, it shows the contents of the file.

![Screenshot 2023-12-20 at 20 25 25](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/1f66b438-33cb-49d9-bbaf-fd9011890387)

### Settings

![Screenshot 2023-12-20 at 20 23 53](https://github.com/electrikmilk/cherri-macos-app/assets/4368524/bea9c3bf-4aba-4758-9cdd-be553b8437a1)

## Dependencies

- [CodeEditorView](https://github.com/mchakravarty/CodeEditorView)

## How to run

### Requirements

- XCode - Download from the Mac App Store.
- Go - Install from Homebrew or [go.dev](https://go.dev/dl/).

### Run

1. Open `Cherri/Cherri.xcodeproj` in XCode.
2. Click the play icon button to build the project after it has been indexed.

This should "install" the project on your Mac, at least temporarily. But if it disappears due to being an unsigned app, just follow the steps above to re-install.
