//
//  CherriLanguage.swift
//  Cherri
//
//  Created by Brandon Jordan on 11/7/26.
//

import Foundation
import LanguageSupport

private let cherriKeywords = [
    "const", "if", "else", "repeat", "for", "in", "menu", "item", "action", "function", "copy", "paste"
]

private let cherriDefinitionKeywords = [
    "name", "color", "glyph", "inputs", "outputs", "from", "version", "mac", "noinput", "quickactions"
]

private let cherriNoInputKeywords = ["stopwith", "askfor", "getclipboard"]

private let cherriTypes = [
    "text", "rawtext", "number", "float", "bool", "array", "dictionary", "variable", "date", "qty"
]

private let cherriLiterals = ["true", "false", "nil"]

private let cherriGlobalVariables = [
    "ShortcutInput", "CurrentDate", "Clipboard", "Device", "Ask", "RepeatItem", "RepeatIndex"
]

// A bare / is excluded when it starts a comment (// or /*).
private let cherriOperatorRegex = /[+\-*\/]=|[=!]=|<=|>=|<>|&&|\|\||\.\.\.|[=+\-*%<>]|\/(?![\/*])/

extension LanguageConfiguration {

    /// Language configuration for Cherri, based on the keywords the Cherri compiler recognizes.
    static func cherri() -> LanguageConfiguration {
        // Pragmas (#define) and variables (@name) are matched as identifiers because reserved identifiers
        // require a word boundary, which cannot precede # or @.
        LanguageConfiguration(name: "Cherri",
                              supportsSquareBrackets: true,
                              supportsCurlyBrackets: true,
                              stringRegex: /"(?:\\.|[^"\\])*+"|'(?:\\.|[^'\\])*+'/,
                              characterRegex: nil,
                              numberRegex: /[0-9]+(?:\.[0-9]+)?/,
                              singleLineComment: "//",
                              nestedComment: (open: "/*", close: "*/"),
                              identifierRegex: /[@#]?[A-Za-z_][A-Za-z0-9_]*/,
                              operatorRegex: cherriOperatorRegex,
                              reservedIdentifiers: cherriKeywords
                                + cherriDefinitionKeywords
                                + cherriNoInputKeywords
                                + cherriTypes
                                + cherriLiterals
                                + cherriGlobalVariables,
                              reservedOperators: [])
    }
}
