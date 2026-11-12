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

private let cherriPragmas = ["#define", "#question", "#include", "#import", "#ref", "#trigger"]

// Emitted as reserved operators, the only other fixed-lexeme token kind, so they get the theme's
// symbolColour instead of sharing the keyword color with pragmas.
private let cherriDefinitionKeywords = [
    "name", "color", "glyph", "inputs", "outputs", "from", "version", "mac", "noinput", "quickactions"
]

private let cherriNoInputKeywords = ["stopwith", "askfor", "getclipboard"]

private let cherriTypes = [
    "text", "rawtext", "number", "float", "bool", "array", "dictionary", "variable", "date", "qty"
]

private let cherriLiterals = ["nil"]

// Booleans and global variables are emitted as number tokens. Every other regex-driven token kind already has a
// Cherri-specific color, so they share the theme's numberColour (orange) instead of the keyword color.
private let cherriNumberRegex = /[0-9]+(?:\.[0-9]+)?|\b(?:true|false|ShortcutInput|CurrentDate|Clipboard|Device|Ask|RepeatItem|RepeatIndex)\b/

// A bare / is excluded when it starts a comment (// or /*).
private let cherriOperatorRegex = /[+\-*\/]=|[=!]=|<=|>=|<>|&&|\|\||\.\.\.|[=+\-*%<>]|\/(?![\/*])/

// Actions and user functions are both called as name(...). CodeEditorView has no token kind for function
// calls and Cherri has no character literals, so calls are emitted as the character token and given their
// own color through the theme's characterColour.
private let cherriFunctionCallRegex = /[A-Za-z_][A-Za-z0-9_]*(?=\()/

extension LanguageConfiguration {

    /// Language configuration for Cherri, based on the keywords the Cherri compiler recognizes.
    static func cherri() -> LanguageConfiguration {
        // Only @variables are matched as identifiers. Constants and parameters are bare names that no token
        // matches, so they render in the theme's plain text color.
        LanguageConfiguration(name: "Cherri",
                              supportsSquareBrackets: true,
                              supportsCurlyBrackets: true,
                              stringRegex: /"(?:\\.|[^"\\])*+"|'(?:\\.|[^'\\])*+'/,
                              characterRegex: cherriFunctionCallRegex,
                              numberRegex: cherriNumberRegex,
                              singleLineComment: "//",
                              nestedComment: (open: "/*", close: "*/"),
                              identifierRegex: /@[A-Za-z_][A-Za-z0-9_]*/,
                              operatorRegex: cherriOperatorRegex,
                              reservedIdentifiers: cherriKeywords
                                + cherriPragmas
                                + cherriTypes
                                + cherriLiterals,
                              reservedOperators: cherriNoInputKeywords + cherriDefinitionKeywords)
    }
}
