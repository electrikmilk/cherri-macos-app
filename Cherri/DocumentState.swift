//
//  AppState.swift
//  Cherri
//
//  Created by Brandon Jordan on 3/5/25.
//

import Foundation
import LanguageSupport

class DocumentState : ObservableObject {
    @Published var fileName: String = ""
    @Published var fileURL: URL = URL(fileURLWithPath: "")
    @Published var shortcutName: String = ""
    @Published var shortcutURL: URL = URL(fileURLWithPath: "")
    @Published var path: String = ""
    
    @Published var messages: Set<TextLocated<Message>> = Set ()
    @Published var hasError: Bool = false
    @Published var hasWarnings: Bool = false

    @Published var compiling: Bool = false
    @Published var compiled: Bool = false
}
