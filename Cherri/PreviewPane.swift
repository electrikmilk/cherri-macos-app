//
//  PreviewPane.swift
//  Cherri
//

import SwiftUI
import WebKit

struct PreviewPane: View {
    @ObservedObject var controller: ShortcutPreviewController
    let isBuilding: Bool
    let hasPreview: Bool

    var body: some View {
        if isBuilding || !controller.isReady {
            loading
        } else if let errorMessage = controller.errorMessage {
            ContentUnavailableView("Unable to show preview",
                                   systemImage: "exclamationmark.triangle",
                                   description: Text(errorMessage))
        } else if !hasPreview {
            ContentUnavailableView("No preview",
                                   systemImage: "rectangle.on.rectangle",
                                   description: Text("Build the Shortcut to see a preview."))
        } else {
            PreviewWebView(webView: controller.webView)
        }
    }

    private var loading: some View {
        VStack(spacing: 12) {
            ProgressView()
            Text("Loading preview")
                .foregroundStyle(.secondary)
        }
        .accessibilityElement(children: .combine)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

private struct PreviewWebView: NSViewRepresentable {
    let webView: WKWebView

    func makeNSView(context: Context) -> WKWebView {
        webView
    }

    func updateNSView(_ webView: WKWebView, context: Context) {}
}
