//
//  CherriApp.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/3/23.
//

import SwiftUI
import Combine

class EditorController: ObservableObject {
    @Published var currentContentView: ContentView? = nil
    func build() {
        Task {
            await currentContentView?.compileFile()
        }
    }
    func buildAndOpen() {
        Task {
            guard let contentView = currentContentView else { return }
            await contentView.compileFile()
            contentView.exportShortcut()
        }
    }
}

private struct ShowActionSearchKey: FocusedValueKey {
    typealias Value = () -> Void
}

extension FocusedValues {
    /// Published by the focused document window, so the menu command acts on the window the user is in.
    var showActionSearch: (() -> Void)? {
        get { self[ShowActionSearchKey.self] }
        set { self[ShowActionSearchKey.self] = newValue }
    }
}

struct ActionSearchCommands: Commands {
    @FocusedValue(\.showActionSearch) private var showActionSearch

    var body: some Commands {
        CommandGroup(after: .textEditing) {
            Button("Search Actions...", systemImage: "magnifyingglass") {
                showActionSearch?()
            }
            .keyboardShortcut("a", modifiers: [.command, .shift])
            .disabled(showActionSearch == nil)
        }
    }
}

@main
struct CherriApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var editorController = EditorController()
    
    var body: some Scene {
        DocumentGroup(newDocument: CherriDocument()) { file in
            ContentView(document: file.$document, fileURL: file.fileURL, editorController: editorController)
                .onAppear {}
        }.commands {
            ImportCommands()
            CommandMenu("Build") {
                Button("Build", systemImage: "hammer.fill") {
                    editorController.build()
                }
                .keyboardShortcut("b", modifiers: [.command])
                .disabled((editorController.currentContentView == nil))
                Button("Build & Open", systemImage: "play.fill") {
                    editorController.buildAndOpen()
                }
                .keyboardShortcut("r", modifiers: [.command])
                .disabled((editorController.currentContentView == nil))
            }
            ActionSearchCommands()
            CommandGroup(replacing: .help) {
                Link("Documentation Site", destination: URL(string: "https://cherrilang.org/language/")!)
            }
            CommandGroup(replacing: CommandGroupPlacement.appInfo) {
                Button(action: {
                    appDelegate.showAboutPanel()
                }) {
                    Text("About \(Bundle.main.appName)")
                }
            }
        }
        
        Window("Import Shortcut", id: ImportWindow.id) {
            ImportView()
        }
        .windowResizability(.contentSize)

        Settings {
            CherriSettings()
        }
        
    }
}
