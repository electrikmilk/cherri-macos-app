//
//  CherriCompletionContext.swift
//  Cherri
//

import Foundation

enum CherriCompletionKind: Equatable {
    case pragma
    case glyph
    case definitionKeyword
    case general
}

/// What can be completed at a cursor position, found by looking only at the text in front of the cursor on its line.
struct CherriCompletionContext: Equatable {
    let kind: CherriCompletionKind
    /// The word being typed, including a leading `#` for pragmas.
    let prefixRange: NSRange
    let prefix: String

    private static let glyphDefinition = /\s*#define\s+glyph\s+/
    private static let definition = /\s*#define\s+/

    private static let variableMarker = UInt16(UInt8(ascii: "@"))
    private static let pragmaMarker = UInt16(UInt8(ascii: "#"))

    /// Returns `nil` where nothing should be offered: strings, line comments, `@variable` names and numbers.
    static func at(location: Int, in text: NSString) -> CherriCompletionContext? {
        guard (0...text.length).contains(location) else { return nil }

        let lineStart = text.range(of: "\n", options: .backwards, range: NSRange(location: 0, length: location)).upperBoundOrZero
        let linePrefix = text.substring(with: NSRange(location: lineStart, length: location - lineStart)) as NSString
        guard !endsInsideStringOrComment(linePrefix as String) else { return nil }

        var wordStart = linePrefix.length
        while wordStart > 0, isIdentifierCharacter(linePrefix.character(at: wordStart - 1)) {
            wordStart -= 1
        }
        if wordStart < linePrefix.length,
           let first = Unicode.Scalar(linePrefix.character(at: wordStart)),
           CharacterSet.decimalDigits.contains(first) {
            return nil
        }

        let precedingCharacter = wordStart > 0 ? linePrefix.character(at: wordStart - 1) : nil
        if precedingCharacter == variableMarker { return nil }

        let isPragma = precedingCharacter == pragmaMarker
        if isPragma { wordStart -= 1 }

        let leading = linePrefix.substring(to: wordStart)
        let kind: CherriCompletionKind
        switch true {
        case isPragma:
            kind = .pragma
        case leading.wholeMatch(of: glyphDefinition) != nil:
            kind = .glyph
        case leading.wholeMatch(of: definition) != nil:
            kind = .definitionKeyword
        default:
            kind = .general
        }

        return CherriCompletionContext(kind: kind,
                                       prefixRange: NSRange(location: lineStart + wordStart, length: linePrefix.length - wordStart),
                                       prefix: linePrefix.substring(from: wordStart))
    }

    private static func isIdentifierCharacter(_ unit: UInt16) -> Bool {
        guard let scalar = Unicode.Scalar(unit) else { return false }
        return CharacterSet.alphanumerics.contains(scalar) || scalar == "_"
    }

    private static func endsInsideStringOrComment(_ linePrefix: String) -> Bool {
        var openQuote: Character?
        var isEscaped = false
        var previous: Character?
        for character in linePrefix {
            defer { previous = character }

            if let quote = openQuote {
                if isEscaped {
                    isEscaped = false
                } else if character == "\\" {
                    isEscaped = true
                } else if character == quote {
                    openQuote = nil
                }
                continue
            }

            if character == "\"" || character == "'" {
                openQuote = character
            } else if character == "/" && previous == "/" {
                return true
            }
        }
        return openQuote != nil
    }
}

private extension NSRange {
    /// `NSNotFound` ranges (no preceding newline) end at the start of the text.
    var upperBoundOrZero: Int {
        location == NSNotFound ? 0 : location + length
    }
}
