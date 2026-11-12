//
//  PreviewSchemeHandler.swift
//  Cherri
//

import Foundation
import WebKit

/// Serves the bundled `Preview` folder over a custom scheme because WebKit blocks ES modules loaded from `file://`.
final class PreviewSchemeHandler: NSObject, WKURLSchemeHandler {
    private static let mimeTypesByExtension: [String: String] = [
        "html": "text/html",
        "mjs": "text/javascript",
        "css": "text/css"
    ]

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        do {
            let fileURL = try bundledFileURL(for: urlSchemeTask.request.url)
            let data = try Data(contentsOf: fileURL)
            let response = URLResponse(url: urlSchemeTask.request.url!,
                                       mimeType: try mimeType(for: fileURL),
                                       expectedContentLength: data.count,
                                       textEncodingName: "utf-8")
            urlSchemeTask.didReceive(response)
            urlSchemeTask.didReceive(data)
            urlSchemeTask.didFinish()
        } catch {
            urlSchemeTask.didFailWithError(error)
        }
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}

    private func bundledFileURL(for requestURL: URL?) throws -> URL {
        guard let requestURL, let previewDirectory = Bundle.main.url(forResource: "Preview", withExtension: nil) else {
            throw URLError(.badURL)
        }

        let relativePath = requestURL.path == "/" ? "index.html" : String(requestURL.path.dropFirst())
        let fileURL = previewDirectory.appendingPathComponent(relativePath).standardizedFileURL
        guard fileURL.path.hasPrefix(previewDirectory.standardizedFileURL.path) else {
            throw URLError(.noPermissionsToReadFile)
        }
        return fileURL
    }

    private func mimeType(for fileURL: URL) throws -> String {
        guard let mimeType = Self.mimeTypesByExtension[fileURL.pathExtension] else {
            throw URLError(.cannotDecodeContentData)
        }
        return mimeType
    }
}
