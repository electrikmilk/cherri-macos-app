//
//  CodeTheme.swift
//  Cherri
//
//  Created by Brandon Jordan on 3/5/25.
//

import Foundation

enum CodeTheme: String, CaseIterable, Identifiable {
    case light = "Light"
    case dark = "Dark"
    
    var id: CodeTheme {
        return self
    }
}
