//
//  CodeTheme.swift
//  Cherri
//
//  Created by Brandon Jordan on 3/5/25.
//

import Foundation
import CodeEditorView

enum CodeTheme: String, CaseIterable, Identifiable {
    case light = "Light"
    case dark = "Dark"

    var id: CodeTheme {
        return self
    }

    var editorTheme: Theme {
        switch self {
        case .light: Self.lightEditorTheme
        case .dark: Self.darkEditorTheme
        }
    }

    // Values mirror the CherriRed, CherriGreen, CherriPurple and BlackCherri colors in the asset catalog.
    // The editor theme is chosen in settings rather than by system appearance, so the adaptive asset
    // colors cannot be used directly.
    private static let darkEditorTheme: Theme = {
        var theme = Theme.defaultDark
        theme.backgroundColour = OSColor(red: 0.153, green: 0.149, blue: 0.169, alpha: 1.0)
        theme.identifierColour = OSColor(red: 0.976, green: 0.431, blue: 0.396, alpha: 1.0)
        // characterColour is the function call color, see cherriFunctionCallRegex.
        theme.characterColour = OSColor(red: 0.28, green: 0.76, blue: 0.90, alpha: 1.0)
        theme.keywordColour = OSColor(red: 0.80, green: 0.52, blue: 0.81, alpha: 1.0)
        theme.stringColour = OSColor(red: 0.50, green: 0.80, blue: 0.42, alpha: 1.0)
        theme.numberColour = OSColor(red: 0.95, green: 0.72, blue: 0.40, alpha: 1.0)
        theme.operatorColour = OSColor(red: 0.70, green: 0.72, blue: 0.78, alpha: 1.0)
        theme.symbolColour = OSColor(red: 0.42, green: 0.62, blue: 1.0, alpha: 1.0)
        return theme
    }()

    private static let lightEditorTheme: Theme = {
        var theme = Theme.defaultLight
        theme.identifierColour = OSColor(red: 0.769, green: 0.196, blue: 0.149, alpha: 1.0)
        theme.characterColour = OSColor(red: 0.0, green: 0.47, blue: 0.64, alpha: 1.0)
        theme.keywordColour = OSColor(red: 0.557, green: 0.231, blue: 0.561, alpha: 1.0)
        theme.stringColour = OSColor(red: 0.0, green: 0.502, blue: 0.004, alpha: 1.0)
        theme.numberColour = OSColor(red: 0.72, green: 0.42, blue: 0.0, alpha: 1.0)
        theme.operatorColour = OSColor(red: 0.35, green: 0.38, blue: 0.45, alpha: 1.0)
        theme.symbolColour = OSColor(red: 0.15, green: 0.25, blue: 0.85, alpha: 1.0)
        return theme
    }()
}
