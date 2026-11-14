//
//  CherriActionRegistry.swift
//  Cherri
//

import Foundation

struct CherriActionCategory: Sendable, Equatable {
    /// The name `--docs=` takes.
    let name: String
    /// The name for people, from the documentation heading.
    let title: String
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
    private static let categoryHeadingSuffix = " Actions"
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
        guard let heading = lines.first, heading.hasPrefix(categoryHeadingPrefix) else {
            throw CherriActionRegistryError.missingCategoryHeading(category: name)
        }
        let title = heading.dropFirst(categoryHeadingPrefix.count).removingSuffix(categoryHeadingSuffix)

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

        let category = CherriActionCategory(name: name, title: title, includePath: includePath, subcategories: subcategories)
        let entries = try blocks.map { block in
            CherriActionEntry(action: try CherriCatalogParser.action(from: block.lines.joined(separator: "\n")),
                              category: category,
                              subcategory: block.subcategory)
        }
        return (category, entries)
    }
}

private extension Substring {
    func removingSuffix(_ suffix: String) -> String {
        hasSuffix(suffix) ? String(dropLast(suffix.count)) : String(self)
    }
}

/// Categories and their actions come from the bundled compiler, separately from the autocomplete catalog.
actor CherriActionRegistry {
    static let shared = CherriActionRegistry()

    struct Contents: Sendable {
        let categories: [CherriActionCategory]
        let entries: [CherriActionEntry]
    }

    private var loading: Task<Contents, Error>?

    func contents() async throws -> Contents {
        let task = loading ?? Task { try await Self.load() }
        loading = task
        do {
            return try await task.value
        } catch {
            loading = nil
            throw error
        }
    }

    private static func load() async throws -> Contents {
        let help = try await CherriCatalog.run(["--help", "--no-ansi"])
        let categoryNames = try CherriDocsParser.categoryNames(fromHelp: help)

        let documentedCategories = try await withThrowingTaskGroup(
            of: (index: Int, category: CherriActionCategory, entries: [CherriActionEntry]).self
        ) { group in
            for (index, name) in categoryNames.enumerated() {
                group.addTask {
                    let docs = try await CherriCatalog.run(["--docs=\(name)", "--no-ansi"])
                    let parsed = try CherriDocsParser.entries(fromDocs: docs, category: name)
                    return (index, parsed.category, parsed.entries)
                }
            }
            return try await group.reduce(into: []) { $0.append($1) }.sorted { $0.index < $1.index }
        }

        let documentedEntries = documentedCategories.flatMap(\.entries)
        let documentedIdentifiers = Set(documentedEntries.map(\.action.identifier))
        let uncategorizedEntries = try await CherriCatalog.shared.entries().actions
            .filter { !documentedIdentifiers.contains($0.identifier) }
            .map { CherriActionEntry(action: $0, category: nil, subcategory: nil) }

        return Contents(categories: documentedCategories.map(\.category),
                        entries: (documentedEntries + uncategorizedEntries)
                            .sorted { $0.action.identifier.lowercased() < $1.action.identifier.lowercased() })
    }
}
