//
//  CherriApp.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/3/23.
//

import SwiftUI

@main
struct CherriApp: App {
    var body: some Scene {
        DocumentGroup(newDocument: CherriDocument()) { file in
            ContentView(document: file.$document, fileURL: file.fileURL ?? URL(fileURLWithPath: ""))
        }.commands {
            CommandGroup(replacing: .help) {
                Link("Documentation Site", destination: URL(string: "https://cherrilang.org/language/")!)
            }
        }
        
        Settings {
            CherriSettings()
        }
    }
}
