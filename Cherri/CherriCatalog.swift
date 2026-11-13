//
//  CherriCatalog.swift
//  Cherri
//

import Foundation

struct CherriAction: Sendable {
    let identifier: String
    let title: String
    let summary: String
    /// Enum declarations and the signature, as the compiler prints them.
    let definition: String
    let signature: String
    let notes: [String]

    var takesParameters: Bool {
        !signature.dropFirst(identifier.count).hasPrefix("()")
    }
}

enum CherriCatalogError: LocalizedError {
    case compilerMissing
    case compilerExited(arguments: [String], status: Int32, output: String)
    case malformedActionDefinition(String)
    case noGlyphs

    var errorDescription: String? {
        switch self {
        case .compilerMissing:
            return "The Cherri compiler is missing from the app bundle."
        case .compilerExited(let arguments, let status, let output):
            return "The Cherri compiler exited with status \(status) for \(arguments.joined(separator: " ")).\n\(output)"
        case .malformedActionDefinition(let block):
            return "Unable to read an action definition from the compiler:\n\(block)"
        case .noGlyphs:
            return "The compiler did not list any glyphs."
        }
    }
}

/// Reads the output of `cherri --action=` and `cherri --glyph=`.
enum CherriCatalogParser {
    private static let actionSeparator = "\n---\n"
    private static let codeFence = "```"
    private static let titlePrefix = "### "
    private static let signatureRegex = /[A-Za-z_][A-Za-z0-9_]*\(/
    private static let glyphRegex = /[A-Za-z0-9]+/

    static func actions(from listing: String) throws -> [CherriAction] {
        try listing
            .components(separatedBy: actionSeparator)
            .filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
            .map(action(from:))
    }

    static func glyphs(from listing: String) throws -> [String] {
        let glyphs = listing
            .split(separator: "\n")
            .map { String($0) }
            .filter { $0.wholeMatch(of: glyphRegex) != nil }
        guard !glyphs.isEmpty else { throw CherriCatalogError.noGlyphs }
        return glyphs
    }

    private static func action(from block: String) throws -> CherriAction {
        let lines = block.components(separatedBy: "\n")
        guard let titleIndex = lines.firstIndex(where: { $0.hasPrefix(titlePrefix) }),
              let fenceStart = lines.firstIndex(of: codeFence),
              titleIndex < fenceStart,
              let fenceEnd = lines[(fenceStart + 1)...].firstIndex(of: codeFence)
        else { throw CherriCatalogError.malformedActionDefinition(block) }

        let definitionLines = Array(lines[(fenceStart + 1)..<fenceEnd])
        guard let signature = definitionLines.first(where: { $0.prefixMatch(of: signatureRegex) != nil }),
              let identifier = signature.split(separator: "(").first.map(String.init)
        else { throw CherriCatalogError.malformedActionDefinition(block) }

        let summary = lines[(titleIndex + 1)..<fenceStart]
            .joined(separator: "\n")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        let notes = lines[(fenceEnd + 1)...]
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { $0.hasPrefix("**") }
            .map { $0.replacingOccurrences(of: "**", with: "") }

        return CherriAction(identifier: identifier,
                            title: String(lines[titleIndex].dropFirst(titlePrefix.count)),
                            summary: summary,
                            definition: definitionLines.joined(separator: "\n").trimmingCharacters(in: .whitespacesAndNewlines),
                            signature: signature,
                            notes: notes)
    }
}

/// Actions and glyphs come from the bundled compiler, so completions always match the compiler the app ships with.
actor CherriCatalog {
    static let shared = CherriCatalog()

    struct Entries: Sendable {
        let actions: [CherriAction]
        let glyphs: [String]
    }

    private var loading: Task<Entries, Error>?

    func entries() async throws -> Entries {
        let task = loading ?? Task { try await Self.load() }
        loading = task
        do {
            return try await task.value
        } catch {
            loading = nil
            throw error
        }
    }

    private static func load() async throws -> Entries {
        async let actionListing = run(["--action=", "--no-ansi"])
        async let glyphListing = run(["--glyph=", "--no-ansi"])
        return try await Entries(actions: CherriCatalogParser.actions(from: actionListing)
                                    .sorted { $0.identifier.lowercased() < $1.identifier.lowercased() },
                                 glyphs: CherriCatalogParser.glyphs(from: glyphListing).sorted())
    }

    private static func run(_ arguments: [String]) async throws -> String {
        guard let compilerURL = Bundle.main.url(forResource: "cherri_binary", withExtension: "") else {
            throw CherriCatalogError.compilerMissing
        }

        let result = try await ProcessRunner.run(executableURL: compilerURL, arguments: arguments)
        guard result.status == 0 else {
            throw CherriCatalogError.compilerExited(arguments: arguments, status: result.status, output: result.output)
        }
        return result.output
    }
}
