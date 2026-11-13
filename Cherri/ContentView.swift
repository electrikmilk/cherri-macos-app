//
//  ContentView.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/3/23.
//

import SwiftUI

import LanguageSupport
import CodeEditorView

struct ContentView: View {
    @AppStorage("Cherri.theme")
    private var theme: CodeTheme = .dark
    
    @AppStorage("Cherri.shareWith")
    private var shareWith: ShareOption = .contacts
    
    @Binding var document: CherriDocument
    var fileURL: URL?
    @State var shortcutURL: URL?
    
    @State var fileName: String = ""
    @State var shortcutName: String = ""
    @State var path: String = ""
    
    @Environment(\.colorScheme) private var colorScheme: ColorScheme
    
    @SceneStorage("editPosition") private var editPosition: CodeEditor.Position = CodeEditor.Position()
    
    @State private var messages:         Set<TextLocated<Message>> = Set ()

    @State private var unlocatedMessages: [UnlocatedMessage]        = []
    
    @State private var showPopover:      Bool                      = false
    
    @AppStorage("Cherri.showMinimap")
    private var showMinimap:             Bool                      = true
    
    @AppStorage("Cherri.wrapText")
    private var wrapText:                Bool                      = true
    
    @State private var hasError:         Bool                      = false
    @State private var hasWarnings:      Bool                      = false
    @State private var busy:             Bool                      = false
    @State private var compiled:         Bool                      = false
    @State private var hasPreview:       Bool                      = false

    @AppStorage("Cherri.showPreview")
    private var showPreview:             Bool                      = true

    @StateObject private var previewController = ShortcutPreviewController()

    @StateObject private var languageService = CherriLanguageService()

    @FocusState private var editorIsFocused: Bool

    @ObservedObject var editorController: EditorController
    
    var body: some View {
        VStack {
            NavigationStack {
                if hasError {
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.red)
                        Text("Unable to compile Shortcut.")
                    }
                    .fontWeight(.bold)
                    .padding(EdgeInsets(top: 12, leading: 0, bottom: 5, trailing: 0))
                }

                if !unlocatedMessages.isEmpty {
                    unlocatedMessagesBanner
                }

                CodeEditor(text: $document.text,
                           position: $editPosition,
                           messages: $messages,
                           language: .cherri(languageService: languageService))
                .environment(\.codeEditorTheme, theme.editorTheme)
                .environment(\.codeEditorLayoutConfiguration,
                             CodeEditor.LayoutConfiguration(showMinimap: showMinimap, wrapText: wrapText))
                .focused($editorIsFocused)
            }.toolbar {
                if !busy && (hasError || hasWarnings || compiled) {
                    ToolbarItemGroup {
                        buildStatus
                    }

                    toolbarGroupSeparator
                }

                ToolbarItemGroup {
                    if busy {
                        ProgressView()
                            .controlSize(.small)
                            .frame(width: 28, height: 24)
                    } else {
                        Button("Build", systemImage: "hammer.fill") {
                            Task {
                                await compileFile()
                            }
                        }
                        .buttonStyle(.automatic)
                        .disabled(fileURL == nil)

                        if compiled {
                            Button("Export", systemImage: "square.and.arrow.up") {
                                exportShortcut()
                            }
                            .buttonStyle(.automatic)
                            .help("Open in Shortcuts")
                        }
                    }
                }

                toolbarGroupSeparator

                ToolbarItem {
                    Button("Preview", systemImage: "sidebar.trailing") {
                        showPreview.toggle()
                    }
                    .help(showPreview ? "Hide Preview" : "Show Preview")
                }
            }
        }
        .inspector(isPresented: $showPreview) {
            PreviewPane(controller: previewController, isBuilding: busy, hasPreview: hasPreview)
                .inspectorColumnWidth(min: 280, ideal: 380, max: 600)
        }
        .frame(minWidth: 300, minHeight: 600)
        .onAppear {
            editorController.currentContentView = self
        }
    }
    
    /// Without a spacer, macOS 26 merges neighboring toolbar items into a single capsule.
    @ToolbarContentBuilder
    private var toolbarGroupSeparator: some ToolbarContent {
        if #available(macOS 26.0, *) {
            ToolbarSpacer(.fixed)
        }
    }

    private var warningCount: Int {
        messages.filter { $0.entity.category == .warning }.count
            + unlocatedMessages.filter { $0.category == .warning }.count
    }

    /// Messages the compiler gave no line and column for cannot be placed in the editor.
    private var unlocatedMessagesBanner: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                ForEach(unlocatedMessages) { message in
                    HStack(alignment: .firstTextBaseline, spacing: 8) {
                        Image(systemName: message.category == .error ? "xmark.octagon.fill" : "exclamationmark.triangle.fill")
                            .foregroundStyle(message.category == .error ? .red : .orange)
                        Text(message.text)
                            .textSelection(.enabled)
                        Spacer(minLength: 0)
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
        }
        .frame(maxHeight: 140)
        .background(.quaternary)
    }

    @ViewBuilder
    private var buildStatus: some View {
        if hasError {
            Button("Unable to compile", systemImage: "xmark.octagon.fill") {
                revealFirstMessage(in: .error)
            }
            .foregroundColor(.red)
            .help("Unable to compile")
        } else if compiled {
            Button("Compiled", systemImage: "checkmark.circle.fill") {
                NSWorkspace.shared
                    .selectFile( "\(shortcutURL!)".replacingOccurrences(of: "%20", with: " "), inFileViewerRootedAtPath: "")
            }.foregroundColor(.green)
            .help("Reveal in Finder")
        }

        if hasWarnings {
            Button {
                revealFirstMessage(in: .warning)
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: "exclamationmark.triangle.fill")
                    Text("\(warningCount)")
                }
            }
            .foregroundColor(.orange)
            .help("This file has warnings")
            .accessibilityLabel("\(warningCount) warnings")
        }
    }

    func parseFilepath() {
        guard let fileURL = fileURL else { return }

        let pathParts = fileURL.relativePath
            .replacingOccurrences(of: "file://", with: "")
            .split(separator: "/")

        fileName = "\(pathParts.last!)"
        path = fileURL.relativePath.replacingOccurrences(of: "/\(pathParts.last!)", with: "")

        shortcutName = fileName.replacingOccurrences(of: ".cherri", with: ".shortcut")

        let nameDefinitionSearch = /(?m)^#define name (.*)$/
        if let result = try? nameDefinitionSearch.firstMatch(in: "\(document.text)") {
            shortcutName = "\(result.1.replacingOccurrences(of: "%20", with: "")).shortcut"
        }

        shortcutURL = URL(string: "\(path)/\(shortcutName.replacingOccurrences(of: "%20", with: ""))")!
    }
    
    func compileFile() async {
        guard let fileURL = fileURL else { return }
        
        busy = true

        if let nsDocument = NSDocumentController.shared.document(for: fileURL) {
            await withCheckedContinuation { continuation in
                nsDocument.save(to: fileURL, ofType: nsDocument.fileType ?? "org.cherrilang.cherri.file", for: .saveOperation) { error in
                    continuation.resume()
                }
            }
        }
        
        compiled = false
        hasError = false
        hasWarnings = false
        hasPreview = false

        parseFilepath()

        messages.removeAll()
        unlocatedMessages.removeAll()

        do {
            try await buildShortcut(fileURL: fileURL)
        } catch {
            hasError = true
            createMessage(message: error.localizedDescription, summary: "Error", category: Message.Category.error)
        }

        busy = false
    }

    func exportShortcut() {
        guard compiled else { return }
        NSWorkspace.shared.open(signedShortcutFileURL)
    }

    private var signedShortcutFileURL: URL {
        URL(fileURLWithPath: path, isDirectory: true)
            .appendingPathComponent(shortcutName.replacingOccurrences(of: "%20", with: ""))
    }

    /// The compiler is not asked to sign so the unsigned plist stays on disk for the preview, then we sign it ourselves.
    /// One compile in debug mode signs the Shortcut and also writes its plist, which the preview needs. Debug mode also
    /// writes a processed copy of the source, so both files are removed after the build.
    private func buildShortcut(fileURL: URL) async throws {
        guard let compilerURL = Bundle.main.url(forResource: "cherri_binary", withExtension: "") else {
            throw BuildError.compilerMissing
        }

        let workingDirectoryURL = URL(fileURLWithPath: path)
        var compilerArguments = [fileURL.relativePath, "--no-ansi", "--debug"]
        if shareWith == .anyone {
            compilerArguments.append("--share=anyone")
        }

        let processedSourceURL = workingDirectoryURL
            .appendingPathComponent("\(fileURL.deletingPathExtension().lastPathComponent)_processed.cherri")
        let processedSourceExisted = FileManager.default.fileExists(atPath: processedSourceURL.path)
        defer {
            if !processedSourceExisted {
                try? FileManager.default.removeItem(at: processedSourceURL)
            }
        }

        let compilation = try await ProcessRunner.run(executableURL: compilerURL,
                                                      arguments: compilerArguments,
                                                      currentDirectoryURL: workingDirectoryURL)
        handleCompilerOutput(output: "\(compilation.output)\n\n")

        guard !hasError else { return }
        guard compilation.status == 0 else {
            throw BuildError.compilerExited(status: compilation.status, output: compilation.output)
        }

        let workflowName = signedShortcutFileURL.deletingPathExtension().lastPathComponent
        let plistFileName = "\(workflowName).plist"
        let plistURL = workingDirectoryURL.appendingPathComponent(plistFileName)
        guard FileManager.default.fileExists(atPath: plistURL.path) else {
            throw BuildError.plistMissing(plistFileName)
        }
        defer { try? FileManager.default.removeItem(at: plistURL) }

        previewController.show(plist: try String(contentsOf: plistURL, encoding: .utf8), name: workflowName)
        hasPreview = true
        compiled = true
    }

    func handleCompilerOutput(output: String) {
        if output.contains("Warning:") {
            let matches = output.matches(of: /Warning: (?<message>(.|\n)*?)\n\n/)
            if matches.count != 0 {
                hasWarnings = true
            }
            for match in matches {
                createMessage(message: String(match.message), summary: "Warning", category: Message.Category.warning)
            }
        }
        if let nativeSigningFailure = output.firstMatch(of: /Failed to sign Shortcut using macOS :\(\n(?<reason>(.|\n)*?)\n\n/) {
            hasWarnings = true
            createMessage(message: "Unable to sign using macOS, the compiler fell back to a signing service.\n\(nativeSigningFailure.reason)",
                          summary: "Warning",
                          category: Message.Category.warning)
        }
        if output.contains("Error:") || output.contains("panic:") {
            hasError = true
            
            // Messages can contain blank lines, so a located error is read up to its trailing (line:column).
            let locatedErrorSearch = /(?s)Error: (?<message>.*?\(\d+:\d+\))\n/
            let errorSearch = /Error: (?<message>(.|\n)*?)\n\n/
            let errorMessage = output.firstMatch(of: locatedErrorSearch).map { String($0.message) }
                ?? output.firstMatch(of: errorSearch).map { String($0.message) }
            if let errorMessage {
                createMessage(message: errorMessage, summary: "Error", category: Message.Category.error)
            }
        }
    }

    func revealFirstMessage(in category: Message.Category) {
        let firstMessage = messages
            .filter { $0.entity.category == category }
            .min { $0.location.zeroBasedLine < $1.location.zeroBasedLine }
        guard let firstMessage else { return }

        let lines = document.text.split(separator: "\n", omittingEmptySubsequences: false)
        let lineIndex = min(firstMessage.location.zeroBasedLine, lines.count - 1)
        let lineStartOffset = lines.prefix(lineIndex).reduce(0) { $0 + $1.utf16.count + 1 }
        let columnOffset = min(firstMessage.location.zeroBasedColumn, lines[lineIndex].utf16.count)

        editPosition.selections = [NSRange(location: lineStartOffset + columnOffset, length: 0)]
        editorIsFocused = true

        Task { @MainActor in
            await Task.yield()
            NSApp.sendAction(#selector(NSResponder.centerSelectionInVisibleArea(_:)), to: nil, from: nil)
        }
    }

    func createMessage(message: String, summary: String, category: Message.Category) {
        let content = message.trimmingCharacters(in: .whitespacesAndNewlines)

        guard let location = try? /\((\d+):(\d+)\)$/.firstMatch(in: content),
              let line = Int(location.1),
              let column = Int(location.2)
        else {
            unlocatedMessages.append(UnlocatedMessage(category: category, text: content))
            return
        }

        let description = content
            .replacingOccurrences(of: " (\(line):\(column))", with: "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        messages.insert(TextLocated(location: TextLocation(oneBasedLine: line, column: column),
                                    entity: Message(category: category,
                                                    length: 1,
                                                    summary: summary,
                                                    description: AttributedString(description))))
    }
}

private struct UnlocatedMessage: Identifiable {
    let id = UUID()
    let category: Message.Category
    let text: String
}

private enum BuildError: LocalizedError {
    case compilerMissing
    case compilerExited(status: Int32, output: String)
    case plistMissing(String)

    var errorDescription: String? {
        switch self {
        case .compilerMissing:
            return "The Cherri compiler is missing from the app bundle."
        case .compilerExited(let status, let output):
            return "The Cherri compiler exited with status \(status).\n\(output)"
        case .plistMissing(let fileName):
            return "The compiler did not produce \(fileName)."
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(document: .constant(CherriDocument(text: "")), fileURL: nil, editorController: EditorController())
            .preferredColorScheme(.dark)
    }
}
