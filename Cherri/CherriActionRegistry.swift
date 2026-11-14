//
//  CherriActionRegistry.swift
//  Cherri
//

import Foundation

struct CherriActionCategory: Sendable, Equatable {
    let name: String
    /// `nil` for categories the compiler includes automatically.
    let includePath: String?
    let subcategories: [String]
}

struct CherriActionEntry: Sendable, Identifiable {
    let action: CherriAction
    /// `nil` for actions the compiler lists but no category documents.
    let category: CherriActionCategory?
    let subcategory: String?

    var id: String { action.identifier }
}

enum CherriActionRegistryError: LocalizedError, Equatable {
    case categoriesNotListed
    case missingCategoryHeading(category: String)

    var errorDescription: String? {
        switch self {
        case .categoriesNotListed:
            return "The Cherri compiler did not list any action categories for --docs=."
        case .missingCategoryHeading(let category):
            return "The documentation for the \(category) category did not start with a category heading."
        }
    }
}

/// Reads the output of `cherri --help` and `cherri --docs=<category>`.
enum CherriDocsParser {
    private static let docsCategoriesRegex = /--docs=.*?\[(?<names>[^\]]+)\]/
    private static let includePathRegex = /#include '(?<path>[^']+)'/
    private static let codeFence = "```"
    private static let categoryHeadingPrefix = "# "
    private static let subcategoryHeadingPrefix = "## "
    private static let actionHeadingPrefix = "### "

    static func categoryNames(fromHelp help: String) throws -> [String] {
        guard let match = help.firstMatch(of: docsCategoriesRegex) else {
            throw CherriActionRegistryError.categoriesNotListed
        }
        return match.names
            .split(separator: ",")
            .map { $0.trimmingCharacters(in: .whitespaces) }
    }

    static func entries(fromDocs docs: String, category name: String) throws -> (category: CherriActionCategory, entries: [CherriActionEntry]) {
        let lines = docs.components(separatedBy: "\n")
        guard lines.first?.hasPrefix(categoryHeadingPrefix) == true else {
            throw CherriActionRegistryError.missingCategoryHeading(category: name)
        }

        var includePath: String?
        var subcategories: [String] = []
        var currentSubcategory: String?
        var blocks: [(subcategory: String?, lines: [String])] = []
        var isInsideBlock = false
        var isInsideCodeFence = false

        for line in lines.dropFirst() {
            if line == codeFence {
                isInsideCodeFence.toggle()
            }

            if !isInsideCodeFence && line.hasPrefix(actionHeadingPrefix) {
                blocks.append((currentSubcategory, [line]))
                isInsideBlock = true
            } else if !isInsideCodeFence && line.hasPrefix(subcategoryHeadingPrefix) {
                let subcategory = String(line.dropFirst(subcategoryHeadingPrefix.count))
                currentSubcategory = subcategory
                if !subcategories.contains(subcategory) {
                    subcategories.append(subcategory)
                }
                isInsideBlock = false
            } else if isInsideBlock {
                blocks[blocks.count - 1].lines.append(line)
            } else if blocks.isEmpty, includePath == nil, let match = line.firstMatch(of: includePathRegex) {
                includePath = String(match.path)
            }
        }

        let category = CherriActionCategory(name: name, includePath: includePath, subcategories: subcategories)
        let entries = try blocks.map { block in
            CherriActionEntry(action: try CherriCatalogParser.action(from: block.lines.joined(separator: "\n")),
                              category: category,
                              subcategory: block.subcategory)
        }
        return (category, entries)
    }
}
