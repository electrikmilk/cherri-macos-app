//
//  ShortcutSigner.swift
//  Cherri
//

import Foundation

enum ShortcutSignerError: LocalizedError {
    case signingFailed(output: String)

    var errorDescription: String? {
        switch self {
        case .signingFailed(let output):
            return "Unable to sign Shortcut.\n\(output)"
        }
    }
}

enum ShortcutSigner {
    private static let shortcutsExecutableURL = URL(fileURLWithPath: "/usr/bin/shortcuts")

    /// Signs the same way the compiler does when it is not given `--skip-sign` on macOS.
    static func sign(unsignedURL: URL, signedURL: URL, shareWith: ShareOption) async throws {
        let result = try await ProcessRunner.run(executableURL: shortcutsExecutableURL,
                                                 arguments: ["sign",
                                                             "-i", unsignedURL.path,
                                                             "-o", signedURL.path,
                                                             "-m", shareWith.signingMode])
        guard result.status == 0 else {
            throw ShortcutSignerError.signingFailed(output: result.output)
        }
    }
}
