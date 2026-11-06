//
//  ShortcutImporter.swift
//  Cherri
//

import Foundation

enum ShortcutImportError: LocalizedError {
    case invalidLink
    case compilerNotFound
    case compilerFailed(message: String)
    case noSourceProduced

    var errorDescription: String? {
        switch self {
        case .invalidLink:
            return "Enter an iCloud link that looks like https://www.icloud.com/shortcuts/..."
        case .compilerNotFound:
            return "The Cherri compiler is missing from the app bundle."
        case .compilerFailed(let message):
            return message
        case .noSourceProduced:
            return "The compiler finished but did not produce a Cherri file."
        }
    }
}

struct ShortcutImporter {
    private struct CompilerResult {
        let exitStatus: Int32
        let output: String
    }

    /// Downloads the Shortcut behind an iCloud link and returns it decompiled to Cherri source.
    func importShortcut(from link: String) async throws -> String {
        let trimmedLink = link.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmedLink.wholeMatch(of: #/https://(www\.)?icloud\.com/shortcuts/.+/#) != nil else {
            throw ShortcutImportError.invalidLink
        }

        guard let compilerURL = Bundle.main.url(forResource: "cherri_binary", withExtension: "") else {
            throw ShortcutImportError.compilerNotFound
        }

        // The compiler names the file after the Shortcut, so give it a fresh directory to write into.
        let outputDirectory = FileManager.default.temporaryDirectory
            .appendingPathComponent("cherri-import-\(UUID().uuidString)", isDirectory: true)
        try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: false)
        // The system purges the temporary directory anyway, so a failed cleanup is not worth surfacing.
        defer { try? FileManager.default.removeItem(at: outputDirectory) }

        // The trailing slash is how the compiler tells a directory apart from a file path.
        let result = try await runCompiler(
            at: compilerURL,
            arguments: ["--import=\(trimmedLink)", "--output=\(outputDirectory.path)/", "--no-ansi"]
        )
        guard result.exitStatus == 0 else {
            throw ShortcutImportError.compilerFailed(message: errorMessage(from: result))
        }

        let sourceFiles = try FileManager.default
            .contentsOfDirectory(at: outputDirectory, includingPropertiesForKeys: nil)
            .filter { $0.pathExtension == "cherri" }
        guard sourceFiles.count == 1, let sourceFile = sourceFiles.first else {
            throw ShortcutImportError.noSourceProduced
        }

        return try String(contentsOf: sourceFile, encoding: .utf8)
    }

    private func runCompiler(at compilerURL: URL, arguments: [String]) async throws -> CompilerResult {
        try await Task.detached {
            let process = Process()
            process.executableURL = compilerURL
            process.arguments = arguments

            let outputPipe = Pipe()
            process.standardInput = FileHandle.nullDevice
            process.standardOutput = outputPipe
            process.standardError = outputPipe

            try process.run()
            let outputData = outputPipe.fileHandleForReading.readDataToEndOfFile()
            process.waitUntilExit()

            return CompilerResult(
                exitStatus: process.terminationStatus,
                output: String(decoding: outputData, as: UTF8.self)
            )
        }.value
    }

    private func errorMessage(from result: CompilerResult) -> String {
        if let match = result.output.firstMatch(of: /Error: (?<message>(.|\n)*?)\n\n/) {
            return String(match.message)
        }

        let trimmedOutput = result.output.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmedOutput.isEmpty {
            return "The Cherri compiler exited with status \(result.exitStatus)."
        }

        return trimmedOutput
    }
}
