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
        currentContentView?.compileFile(openCompiled: false)
    }
    func buildAndOpen() {
        currentContentView?.compileFile(openCompiled: true)
    }
}

@main
struct CherriApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var editorController = EditorController()
    
    var body: some Scene {
        DocumentGroup(newDocument: CherriDocument()) { file in
            ContentView(document: file.$document, fileURL: file.fileURL ?? URL(fileURLWithPath: ""), editorController: editorController)
                .onAppear {}
        }.commands {
            CommandMenu("Build") {
                Button("Build", systemImage: "hammer.fill") {
                    editorController.build()
                }
                .keyboardShortcut("b", modifiers: [.command])
                Button("Build & Open in Shortcuts", systemImage: "play.fill") {
                    editorController.buildAndOpen()
                }
                .keyboardShortcut("r", modifiers: [.command])
            }
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
        
        Settings {
            CherriSettings()
        }
        
    }
}
