//
//  ShortcutPreviewController.swift
//  Cherri
//

import SwiftUI
import WebKit

/// Owns the web view that renders a built Shortcut using the bundled preview-shortcut page.
@MainActor
final class ShortcutPreviewController: NSObject, ObservableObject, WKNavigationDelegate, WKScriptMessageHandler {
    private static let scheme = "cherri-preview"
    private static let readyMessageName = "previewReady"

    let webView: WKWebView

    @Published private(set) var isReady: Bool = false
    @Published private(set) var errorMessage: String?

    private var pendingPreview: (plist: String, name: String)?

    override init() {
        let configuration = WKWebViewConfiguration()
        configuration.setURLSchemeHandler(PreviewSchemeHandler(), forURLScheme: Self.scheme)
        webView = WKWebView(frame: .zero, configuration: configuration)

        super.init()

        webView.navigationDelegate = self
        configuration.userContentController.add(WeakScriptMessageHandler(target: self), name: Self.readyMessageName)
        webView.load(URLRequest(url: URL(string: "\(Self.scheme)://app/")!))
    }

    func show(plist: String, name: String) {
        guard isReady else {
            pendingPreview = (plist, name)
            return
        }

        Task {
            do {
                _ = try await webView.callAsyncJavaScript("window.showShortcutPreview(plist, name)",
                                                      arguments: ["plist": plist, "name": name],
                                                      in: nil,
                                                      contentWorld: .page)
                errorMessage = nil
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        isReady = true

        guard let pendingPreview else { return }
        self.pendingPreview = nil
        show(plist: pendingPreview.plist, name: pendingPreview.name)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        errorMessage = error.localizedDescription
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        errorMessage = error.localizedDescription
    }
}

/// `WKUserContentController` retains its handlers, which would keep the controller alive after its window closes.
private final class WeakScriptMessageHandler: NSObject, WKScriptMessageHandler {
    private weak var target: WKScriptMessageHandler?

    init(target: WKScriptMessageHandler) {
        self.target = target
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(userContentController, didReceive: message)
    }
}
