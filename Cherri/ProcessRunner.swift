//
//  ProcessRunner.swift
//  Cherri
//

import Foundation

struct ProcessResult {
    let status: Int32
    let output: String
}

enum ProcessRunnerError: LocalizedError {
    case undecodableOutput(executable: String)

    var errorDescription: String? {
        switch self {
        case .undecodableOutput(let executable):
            return "Unable to read the output of \(executable)."
        }
    }
}

enum ProcessRunner {
    /// Runs the process off the main thread so the UI stays responsive. Standard output and error are merged.
    static func run(executableURL: URL, arguments: [String], currentDirectoryURL: URL? = nil) async throws -> ProcessResult {
        try await Task.detached {
            let process = Process()
            process.executableURL = executableURL
            process.arguments = arguments
            process.currentDirectoryURL = currentDirectoryURL

            let pipe = Pipe()
            process.standardOutput = pipe
            process.standardError = pipe

            try process.run()
            let data = pipe.fileHandleForReading.readDataToEndOfFile()
            process.waitUntilExit()

            guard let output = String(data: data, encoding: .utf8) else {
                throw ProcessRunnerError.undecodableOutput(executable: executableURL.lastPathComponent)
            }
            return ProcessResult(status: process.terminationStatus, output: output)
        }.value
    }
}
