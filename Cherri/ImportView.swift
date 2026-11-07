//
//  ImportView.swift
//  Cherri
//
//  Created by Brandon Jordan on 11/29/25.
//

import SwiftUI

enum ImportWindow {
    static let id = "import"
}

struct ImportView: View {
    @Environment(\.newDocument) private var newDocument
    @Environment(\.dismissWindow) private var dismissWindow

    @State private var link = ""
    @State private var isImporting = false
    @State private var errorMessage: String?
    @FocusState private var linkFieldIsFocused: Bool

    private let importer = ShortcutImporter()
    private let steps = ["Go to Shortcuts", "Share Your Shortcut", "Copy iCloud Link"]

    private var canImport: Bool {
        !link.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isImporting
    }

    var body: some View {
        VStack(spacing: 24) {
            header
            stepList
            linkField
            if let errorMessage {
                errorBanner(errorMessage)
            }
            actions
        }
        .padding(32)
        .frame(width: 460)
        .onAppear { linkFieldIsFocused = true }
    }

    private var header: some View {
        VStack(spacing: 12) {
            Image(systemName: "square.and.arrow.down")
                .font(.system(size: 26, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 60, height: 60)
                .background(
                    LinearGradient(colors: [.indigo, .purple], startPoint: .topLeading, endPoint: .bottomTrailing),
                    in: RoundedRectangle(cornerRadius: 14, style: .continuous)
                )
                .accessibilityHidden(true)

            HStack(spacing: 8) {
                Text("Import Shortcut")
                    .font(.title)
                    .bold()
                Text("Beta")
                    .font(.caption.bold())
                    .foregroundStyle(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(.indigo, in: Capsule())
            }

            Text("Convert a Shortcut into Cherri code.")
                .foregroundStyle(.secondary)
        }
    }

    private var stepList: some View {
        VStack(alignment: .leading, spacing: 10) {
            ForEach(Array(steps.enumerated()), id: \.offset) { index, step in
                HStack(spacing: 12) {
                    Text("\(index + 1)")
                        .font(.caption.bold())
                        .foregroundStyle(.white)
                        .frame(width: 22, height: 22)
                        .background(.indigo, in: Circle())
                    Text(step)
                }
                .accessibilityElement(children: .combine)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(.quaternary.opacity(0.5), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private var linkField: some View {
        TextField("iCloud link", text: $link, prompt: Text("https://www.icloud.com/shortcuts/..."))
            .textFieldStyle(.roundedBorder)
            .controlSize(.large)
            .focused($linkFieldIsFocused)
            .disabled(isImporting)
    }

    private func errorBanner(_ message: String) -> some View {
        Label(message, systemImage: "exclamationmark.triangle.fill")
            .font(.callout)
            .foregroundStyle(.red)
            .frame(maxWidth: .infinity, alignment: .leading)
            .fixedSize(horizontal: false, vertical: true)
    }

    private var actions: some View {
        HStack {
            Spacer()
            Button("Cancel", role: .cancel) {
                dismissWindow(id: ImportWindow.id)
            }
            .keyboardShortcut(.cancelAction)
            .disabled(isImporting)

            Button(action: startImport) {
                HStack(spacing: 6) {
                    if isImporting {
                        ProgressView().controlSize(.small)
                    }
                    Text(isImporting ? "Importing..." : "Import")
                }
            }
            .keyboardShortcut(.defaultAction)
            .disabled(!canImport)
        }
        .controlSize(.large)
    }

    private func startImport() {
        errorMessage = nil
        isImporting = true

        Task {
            do {
                let sourceCode = try await importer.importShortcut(from: link)
                newDocument(CherriDocument(text: sourceCode))
                link = ""
                dismissWindow(id: ImportWindow.id)
            } catch {
                errorMessage = error.localizedDescription
            }
            isImporting = false
        }
    }
}

struct ImportCommands: Commands {
    @Environment(\.openWindow) private var openWindow

    var body: some Commands {
        CommandGroup(after: .newItem) {
            Button("Import Shortcut...", systemImage: "square.and.arrow.down") {
                openWindow(id: ImportWindow.id)
            }
            .keyboardShortcut("i", modifiers: [.command])
        }
    }
}

#Preview {
    ImportView()
}
