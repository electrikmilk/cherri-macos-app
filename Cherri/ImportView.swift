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
    @Environment(\.colorScheme) private var colorScheme

    @State private var link = ""
    @State private var isImporting = false
    @State private var errorMessage: String?
    @FocusState private var linkFieldIsFocused: Bool

    private let importer = ShortcutImporter()

    private var canImport: Bool {
        !link.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isImporting
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            header
            linkField
            instructions
            if let errorMessage {
                errorBanner(errorMessage)
            }
            actions
        }
        .padding(28)
        .frame(width: 480)
        .background(colorScheme == .dark ? Color("BlackCherri") : Color(nsColor: .windowBackgroundColor))
        .onAppear { linkFieldIsFocused = true }
    }

    private var header: some View {
        HStack(spacing: 8) {
            Text("Convert Shortcut to Cherri code")
                .font(.title3)
                .bold()
            Text("BETA")
                .font(.caption.bold())
                .foregroundStyle(.white)
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Color("CherriPurple"), in: Capsule())
        }
    }

    private var linkField: some View {
        HStack(spacing: 10) {
            Image(systemName: "link.icloud")
                .font(.title3)
                .foregroundStyle(Color("CherriRed"))
                .accessibilityHidden(true)

            TextField("iCloud Link", text: $link)
                .textFieldStyle(.plain)
                .font(.title3)
                .focused($linkFieldIsFocused)
                .disabled(isImporting)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .background(Color(nsColor: .controlBackgroundColor), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .strokeBorder(
                    linkFieldIsFocused ? Color("CherriRed") : Color.primary.opacity(0.15),
                    lineWidth: linkFieldIsFocused ? 2 : 1
                )
        )
    }

    private var instructions: some View {
        HStack(spacing: 6) {
            Text("Go to Shortcuts")
            Image(systemName: "arrow.right")
            Text("Share Your Shortcut")
            Image(systemName: "arrow.right")
            Text("Copy iCloud Link").bold()
        }
        .font(.callout)
        .foregroundStyle(.secondary)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Go to Shortcuts, then Share Your Shortcut, then Copy iCloud Link")
    }

    private func errorBanner(_ message: String) -> some View {
        Label(message, systemImage: "exclamationmark.triangle.fill")
            .font(.callout)
            .foregroundStyle(Color("CherriRed"))
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
                    } else {
                        Image(systemName: "icloud.and.arrow.down")
                    }
                    Text(isImporting ? "Importing..." : "Import")
                }
            }
            .buttonStyle(.borderedProminent)
            .tint(Color("CherriGreen"))
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
