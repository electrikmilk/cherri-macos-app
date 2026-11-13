//
//  CherriLanguageService.swift
//  Cherri
//

import Combine
import LanguageSupport
import os
import SwiftUI

enum CherriLanguageServiceError: LocalizedError {
    case changeOutOfRange(position: Int, replacedLength: Int, documentLength: Int)

    var errorDescription: String? {
        switch self {
        case .changeOutOfRange(let position, let replacedLength, let documentLength):
            return "A document change at \(position) replacing \(replacedLength) characters is outside the \(documentLength) character document."
        }
    }
}

/// Offers completions for keywords, actions and glyphs. There is one per open document because it follows the document text.
final class CherriLanguageService: LanguageService, ObservableObject {
    private static let logger = Logger(subsystem: "Cherri", category: "CherriLanguageService")

    private let catalog: CherriCatalog
    private let lock = NSLock()
    private var text: NSString = ""

    private(set) var isOpen = false
    let events = PassthroughSubject<LanguageServiceEvent, Never>()
    let diagnostics = CurrentValueSubject<Set<TextLocated<Message>>, Never>(Set())
    let completionTriggerCharacters = CurrentValueSubject<[Character], Never>([])
    let extraActions = CurrentValueSubject<[ExtraAction], Never>([])

    init(catalog: CherriCatalog = .shared) {
        self.catalog = catalog
    }

    // MARK: Document synchronisation

    func openDocument(with text: String, locationService: LocationService) async throws {
        replaceDocument(with: text)
        isOpen = true

        // Loads the catalog now so the first completion does not wait for the compiler. A failure is raised again by
        // the first completion that needs the catalog.
        let catalog = catalog
        Task {
            do {
                _ = try await catalog.entries()
            } catch {
                Self.logger.error("Unable to load actions and glyphs: \(error.localizedDescription)")
            }
        }
    }

    func documentDidChange(position changeLocation: Int,
                           changeInLength delta: Int,
                           lineChange deltaLine: Int,
                           columnChange deltaColumn: Int,
                           newText text: String) async throws {
        try applyChange(at: changeLocation, changeInLength: delta, newText: text)
    }

    func closeDocument() async throws {
        isOpen = false
        replaceDocument(with: "")
    }

    private func applyChange(at location: Int, changeInLength delta: Int, newText: String) throws {
        let replacedLength = (newText as NSString).length - delta

        lock.lock()
        defer { lock.unlock() }
        guard location >= 0, replacedLength >= 0, location + replacedLength <= text.length else {
            throw CherriLanguageServiceError.changeOutOfRange(position: location,
                                                              replacedLength: replacedLength,
                                                              documentLength: text.length)
        }
        text = text.replacingCharacters(in: NSRange(location: location, length: replacedLength), with: newText) as NSString
    }

    private func replaceDocument(with newText: String) {
        lock.lock()
        defer { lock.unlock() }
        text = newText as NSString
    }

    private var documentText: NSString {
        lock.lock()
        defer { lock.unlock() }
        return text
    }

    // MARK: Code completion

    func completions(at location: Int, reason: CompletionTriggerReason) async throws -> Completions {
        guard let context = CherriCompletionContext.at(location: location, in: documentText) else { return .none }

        let candidates = try await candidates(for: context.kind)
        let items = candidates
            .compactMap { candidate in
                candidate.matchRank(for: context.prefix).map { (candidate, $0) }
            }
            .enumerated()
            .map { index, match in
                match.0.completion(id: index, replacing: context.prefixRange, rank: match.1)
            }
        return Completions(isIncomplete: true, items: items)
    }

    private func candidates(for kind: CherriCompletionKind) async throws -> [Candidate] {
        switch kind {
        case .pragma:
            return cherriPragmas.map { Candidate.keyword($0, kind: "Pragma") }
        case .definitionKeyword:
            return cherriDefinitionKeywords.map { Candidate.keyword($0, kind: "Definition") }
        case .glyph:
            return try await catalog.entries().glyphs.map(Candidate.glyph)
        case .general:
            let keywords = cherriKeywords.map { Candidate.keyword($0, kind: "Keyword") }
                + cherriNoInputKeywords.map { Candidate.keyword($0, kind: "Keyword") }
                + cherriTypes.map { Candidate.keyword($0, kind: "Type") }
                + (cherriLiterals + cherriBooleans).map { Candidate.keyword($0, kind: "Literal") }
            return try await keywords + catalog.entries().actions.map(Candidate.action)
        }
    }

    // MARK: Unused services

    func tokens(for lineRange: Range<Int>) async throws -> [[(token: LanguageConfiguration.Token, range: NSRange)]] {
        Array(repeating: [], count: lineRange.count)
    }

    func info(at location: Int) async throws -> (view: any View, anchor: NSRange?)? {
        nil
    }

    func capabilities() async throws -> (any View)? {
        nil
    }
}

private struct Candidate {
    let name: String
    let insertText: String
    let detail: String
    /// Glyph names are matched anywhere because they are long and descriptive, the rest only by their start.
    let matchesAnywhere: Bool
    let documentation: AnyView

    static func keyword(_ name: String, kind: String) -> Candidate {
        Candidate(name: name,
                  insertText: name,
                  detail: kind,
                  matchesAnywhere: false,
                  documentation: AnyView(Text(kind).foregroundStyle(.secondary).padding(.vertical, 4)))
    }

    static func glyph(_ name: String) -> Candidate {
        Candidate(name: name,
                  insertText: name,
                  detail: "Glyph",
                  matchesAnywhere: true,
                  documentation: AnyView(Text("Glyph").foregroundStyle(.secondary).padding(.vertical, 4)))
    }

    static func action(_ action: CherriAction) -> Candidate {
        Candidate(name: action.identifier,
                  insertText: action.takesParameters ? "\(action.identifier)(" : "\(action.identifier)()",
                  detail: action.title,
                  matchesAnywhere: false,
                  documentation: AnyView(ActionDocumentation(action: action)))
    }

    /// 0 when the name starts with the prefix, 1 when it only contains it, `nil` when it does not match.
    func matchRank(for prefix: String) -> Int? {
        guard !prefix.isEmpty else { return 0 }
        let lowercasedName = name.lowercased()
        let lowercasedPrefix = prefix.lowercased()
        if lowercasedName.hasPrefix(lowercasedPrefix) { return 0 }
        return matchesAnywhere && lowercasedName.contains(lowercasedPrefix) ? 1 : nil
    }

    func completion(id: Int, replacing range: NSRange, rank: Int) -> Completions.Completion {
        let name = name
        let detail = detail
        return Completions.Completion(id: id,
                                      rowView: { _ in
                                          HStack(spacing: 12) {
                                              Text(name).font(.system(.body, design: .monospaced))
                                              Spacer()
                                              Text(detail).foregroundStyle(.secondary)
                                          }
                                          .padding(.horizontal, 8)
                                      },
                                      documentationView: documentation,
                                      selected: false,
                                      sortText: "\(rank)\(name.lowercased())",
                                      filterText: name,
                                      insertText: insertText,
                                      insertRange: range,
                                      commitCharacters: [],
                                      refine: { nil })
    }
}

private struct ActionDocumentation: View {
    let action: CherriAction

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(action.title).font(.headline)
            if !action.summary.isEmpty {
                Text(action.summary)
            }
            Text(action.definition)
                .font(.system(.callout, design: .monospaced))
                .textSelection(.enabled)
            ForEach(action.notes, id: \.self) { note in
                Text(note).font(.callout).foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}
