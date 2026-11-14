//
//  ActionInsertion.swift
//  Cherri
//

import Foundation

struct ActionInsertionResult: Equatable {
    let text: String
    let selection: NSRange
}

/// Inserts an action into the editor text and adds the include its category needs. All offsets are UTF-16.
enum ActionInsertion {
    private static let includeDirective = "#include"
    private static let includePathRegex = /#include\s+['"](?<path>[^'"]+)['"]/

    private struct IncludeBlock {
        let paths: [String]
        /// Where the line after the last `#include` line starts, `0` when there is none.
        let endOffset: Int
        let lastLineLacksNewline: Bool
    }

    /// The selection is replaced first, then the include goes below the last `#include` line of the resulting text.
    /// That keeps the selected characters exactly replaced even when the selection overlaps the include lines.
    static func insert(_ entry: CherriActionEntry, into text: String, replacing requestedSelection: NSRange) -> ActionInsertionResult {
        let selection = clamped(requestedSelection, toLength: text.utf16.count)
        let actionText = entry.action.insertionText
        let replacedText = (text as NSString).replacingCharacters(in: selection, with: actionText)
        let actionStart = selection.location
        let caretOffset = actionStart + actionText.utf16.count

        let includeBlock = includeBlock(in: replacedText)
        guard let includePath = entry.category?.includePath, !includeBlock.paths.contains(includePath) else {
            return ActionInsertionResult(text: replacedText, selection: NSRange(location: caretOffset, length: 0))
        }

        let includeText = (includeBlock.lastLineLacksNewline ? "\n" : "") + "\(includeDirective) '\(includePath)'\n"
        let textWithInclude = (replacedText as NSString).replacingCharacters(in: NSRange(location: includeBlock.endOffset, length: 0),
                                                                             with: includeText)
        let shiftedCaretOffset = includeBlock.endOffset <= actionStart ? caretOffset + includeText.utf16.count : caretOffset
        return ActionInsertionResult(text: textWithInclude, selection: NSRange(location: shiftedCaretOffset, length: 0))
    }

    /// The editor's saved selection can be stale, and a range outside the text would crash the replacement.
    private static func clamped(_ range: NSRange, toLength length: Int) -> NSRange {
        let location = min(range.location, length)
        return NSRange(location: location, length: min(range.length, length - location))
    }

    private static func includeBlock(in text: String) -> IncludeBlock {
        let nsText = text as NSString
        var paths: [String] = []
        var endOffset = 0
        nsText.enumerateSubstrings(in: NSRange(location: 0, length: nsText.length), options: .byLines) { line, _, enclosingRange, _ in
            let unindentedLine = line?.drop { $0.isWhitespace }
            guard let unindentedLine, unindentedLine.hasPrefix(includeDirective) else { return }
            endOffset = NSMaxRange(enclosingRange)
            if let match = unindentedLine.prefixMatch(of: includePathRegex) {
                paths.append(String(match.path))
            }
        }
        let lastLineLacksNewline = endOffset > 0 && nsText.substring(with: NSRange(location: endOffset - 1, length: 1)) != "\n"
        return IncludeBlock(paths: paths, endOffset: endOffset, lastLineLacksNewline: lastLineLacksNewline)
    }
}
