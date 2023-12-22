//
//  ContentView.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/3/23.
//

import SwiftUI

import LanguageSupport
import CodeEditorView

struct MessageEntry {
    @Binding var messages: Set<TextLocated<Message>>
    
    @Environment(\.presentationMode) private var presentationMode
    
    @State private var category:  Message.Category = .error
    @State private var summary:   String           = ""
    @State private var lineStr:   String           = ""
    @State private var columnStr: String           = ""
    @State private var message:   String           = ""
}

struct ContentView: View {
    @AppStorage("Cherri.theme")
    private var theme: CodeTheme = .dark
    
    enum CodeTheme: String, CaseIterable, Identifiable {
        case light = "Light"
        case dark = "Dark"
        
        var id: CodeTheme {
            return self
        }
    }
    
    @AppStorage("Cherri.shareWith")
    private var shareWith: ShareOption = .contacts
    
    enum ShareOption: String, CaseIterable, Identifiable {
        case contacts = "Contacts"
        case anyone = "Anyone"
        
        var id: ShareOption {
            return self
        }
    }
    
    @Binding var document: CherriDocument
    @State var fileURL: URL
    @State var shortcutURL: URL?
    
    @State var fileName: String = ""
    @State var shortcutName: String = ""
    @State var path: String = ""
    
    @Environment(\.colorScheme) private var colorScheme: ColorScheme
    
    @SceneStorage("editPosition") private var editPosition: CodeEditor.Position = CodeEditor.Position()
    
    @State private var messages:         Set<TextLocated<Message>> = Set ()
    
    @State private var showPopover:      Bool                      = false
    
    @AppStorage("Cherri.showMinimap")
    private var showMinimap:             Bool                      = true
    
    @AppStorage("Cherri.wrapText")
    private var wrapText:                Bool                      = true
    
    @State private var hasError:         Bool                      = false
    @State private var hasWarnings:      Bool                      = false
    @State private var compiling:        Bool                      = false
    @State private var compiled:         Bool                      = false
    
    @FocusState private var editorIsFocused: Bool
    
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
                
                CodeEditor(text: $document.text,
                           position: $editPosition,
                           messages: $messages,
                           language: .swift(),
                           layout: CodeEditor.LayoutConfiguration(showMinimap: showMinimap, wrapText: wrapText))
                .environment(\.codeEditorTheme, theme == .dark ? Theme.defaultDark : Theme.defaultLight)
                .focused($editorIsFocused)
            }.toolbar {
                HStack {
                    if compiling {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle())
                            .scaleEffect(x: 0.5, y: 0.5, anchor: .center)
                            .padding(EdgeInsets(top: 5, leading: 5, bottom: 5, trailing: 0))
                    } else {
                        Button("Build", systemImage: "hammer.fill") {
                            Task {
                                compileFile(openCompiled: false)
                            }
                        }
                        .buttonStyle(.automatic)
                        
                        Button("Run", systemImage: "play.fill") {
                            Task {
                                compileFile(openCompiled: true)
                            }
                        }.buttonStyle(.automatic)
                        
                        if hasError || compiled {
                            Spacer().frame(width: 20)
                        }
                        
                        if hasError {
                            Image(systemName: "x.circle.fill")
                                .foregroundColor(.red)
                        } else if compiled {
                            Button("Compiled", systemImage: "checkmark.circle.fill") {
                                NSWorkspace.shared
                                    .selectFile( "\(shortcutURL!)".replacingOccurrences(of: "%20", with: " "), inFileViewerRootedAtPath: "")
                            }.foregroundColor(.green)
                        }
                        
                        if hasWarnings {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.orange)
                        }
                    }
                }
            }
        }.frame(minWidth: 300, minHeight: 600)
    }
    
    func parseFilepath() {
        let pathParts = fileURL.relativePath
            .replacingOccurrences(of: "file://", with: "")
            .split(separator: "/")

        fileName = "\(pathParts.last!)"
        path = fileURL.relativePath.replacingOccurrences(of: "/\(pathParts.last!)", with: "")

        shortcutName = fileName.replacingOccurrences(of: ".cherri", with: ".shortcut")

        let nameDefinitionSearch = /^#define name (.*?)\n/
        if let result = try? nameDefinitionSearch.firstMatch(in: "\(document.text)") {
            shortcutName = "\(result.1.replacingOccurrences(of: "%20", with: "")).shortcut"
        }

        shortcutURL = URL(string: "\(path)/\(shortcutName.replacingOccurrences(of: "%20", with: ""))")!
    }
    
    func compileFile(openCompiled: Bool) {
        compiled = false
        hasError = false
        hasWarnings = false
        compiling = true
        
        parseFilepath()
        
        messages.removeAll()
        
        let process = Process()
        
        let bundle = Bundle.main
        process.executableURL = bundle.url(forResource: "cherri_binary", withExtension: "")
        process.arguments = [fileURL.relativePath, "--no-ansi"]
        process.currentDirectoryURL = URL(fileURLWithPath: path)
        
        if openCompiled {
            process.arguments?.append("-i")
        }
        if shareWith == .contacts {
            process.arguments?.append("--share=contacts")
        }
        
        let pipe = Pipe()
        process.standardInput = nil
        process.standardOutput = pipe
        process.standardError = pipe
        
        process.launch()
        
        let data = pipe.fileHandleForReading.readDataToEndOfFile()
        let output = String(data: data, encoding: .utf8)!
        
        handleCompilerOutput(output: "\(output)\n\n")
        
        compiling = false
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
        if output.contains("Error:") || output.contains("panic:") {
            hasError = true
            
            let errorSearch = /Error: (?<message>(.|\n)*?)\n\n/
            if let error = try? errorSearch.firstMatch(in: output) {
                createMessage(message: String(error.1), summary: "Error", category: Message.Category.error)
            }
        }
        if !hasError {
            compiled = true
        }
    }

    func createMessage(message: String, summary: String, category: Message.Category) {
        let lineColSearch = /(\d+):(\d+)/
        var messageContent = message
        var line = "1"
        var col = "1"
        if let result = try? lineColSearch.firstMatch(in: messageContent) {
            line = "\(result.1)"
            col = "\(result.2)"
            
            let replaceLineCol = " ("+line+":"+col+")"
            messageContent = messageContent.replacingOccurrences(of: replaceLineCol, with: "")
        }
        
        messageContent = messageContent.trimmingCharacters(in: NSCharacterSet.whitespacesAndNewlines)
        
        messages.insert(TextLocated(location: TextLocation(oneBasedLine: Int(line) ?? 1, column: Int(col) ?? 1),
                                    entity: Message(category: category,
                                                    length: 1,
                                                    summary: summary,
                                                    description: NSAttributedString(string: messageContent))))
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(document: .constant(CherriDocument(text: "")), fileURL: URL(filePath: "")!)
            .preferredColorScheme(.dark)
    }
}
