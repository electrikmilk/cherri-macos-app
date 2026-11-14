//
//  ActionSearchRanker.swift
//  Cherri
//

import Foundation

/// Fuzzy search over action identifiers and descriptions.
enum ActionSearchRanker {
    private static let identifierPrefixScore = 100
    private static let identifierContiguousScore = 50
    private static let consecutiveCharacterScore = 10
    private static let wordStartScore = 5
    private static let descriptionTokenScore = 20

    /// An empty query returns every entry in its original order, otherwise only matching entries, best first.
    static func rank(_ entries: [CherriActionEntry], matching query: String) -> [CherriActionEntry] {
        let tokens = query.lowercased().split { !$0.isLetter && !$0.isNumber }.map { Array($0) }
        guard !tokens.isEmpty else { return entries }

        let identifierQuery = Array(tokens.joined())
        return entries
            .compactMap { entry -> (entry: CherriActionEntry, score: Int)? in
                let scores = [identifierScore(of: entry.action.identifier, for: identifierQuery),
                              descriptionScore(of: entry.action, for: tokens)]
                guard let bestScore = scores.compactMap({ $0 }).max() else { return nil }
                return (entry, bestScore)
            }
            .sorted { lhs, rhs in
                guard lhs.score == rhs.score else { return lhs.score > rhs.score }
                return lhs.entry.action.identifier.lowercased() < rhs.entry.action.identifier.lowercased()
            }
            .map(\.entry)
    }

    private static func identifierScore(of identifier: String, for query: [Character]) -> Int? {
        let characters = Array(identifier)
        let lowercasedCharacters = Array(identifier.lowercased())
        guard let positions = subsequencePositions(of: query, in: lowercasedCharacters),
              let firstPosition = positions.first
        else { return nil }

        let lowercasedIdentifier = String(lowercasedCharacters)
        let lowercasedQuery = String(query)
        var score = -firstPosition
        if lowercasedIdentifier.hasPrefix(lowercasedQuery) {
            score += identifierPrefixScore
        }
        if lowercasedIdentifier.contains(lowercasedQuery) {
            score += identifierContiguousScore
        }
        score += consecutiveCharacterScore * zip(positions, positions.dropFirst()).filter { $1 == $0 + 1 }.count
        score += wordStartScore * positions.filter { characters.indices.contains($0) && characters[$0].isUppercase }.count
        return score
    }

    private static func descriptionScore(of action: CherriAction, for tokens: [[Character]]) -> Int? {
        let words = "\(action.title) \(action.summary)"
            .lowercased()
            .split { !$0.isLetter && !$0.isNumber }
            .map { Array($0) }
        let everyTokenMatchesAWord = tokens.allSatisfy { token in
            words.contains { subsequencePositions(of: token, in: $0) != nil }
        }
        return everyTokenMatchesAWord ? descriptionTokenScore * tokens.count : nil
    }

    /// Positions of the leftmost match of `query` as an ordered subsequence of `text`, or `nil` when it does not occur.
    private static func subsequencePositions(of query: [Character], in text: [Character]) -> [Int]? {
        var positions: [Int] = []
        var searchStart = 0
        for queryCharacter in query {
            guard let position = text[searchStart...].firstIndex(of: queryCharacter) else { return nil }
            positions.append(position)
            searchStart = position + 1
        }
        return positions
    }
}
