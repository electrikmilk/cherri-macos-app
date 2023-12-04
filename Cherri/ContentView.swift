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
    @Binding var document: CherriDocument
    @State var fileURL: URL
    
    @Environment(\.colorScheme) private var colorScheme: ColorScheme
    
    @SceneStorage("editPosition") private var editPosition: CodeEditor.Position = CodeEditor.Position()
    
    @State private var messages:         Set<TextLocated<Message>> = Set ()
    @State private var showMessageEntry: Bool                      = false
    @State private var showMinimap:      Bool                      = true
    @State private var showPopover:      Bool                      = false
    @State private var wrapText:         Bool                      = true
    
    @FocusState private var editorIsFocused: Bool
    
    var body: some View {
        VStack {
            NavigationStack {
                CodeEditor(text: $document.text,
                           position: $editPosition,
                           messages: $messages,
                           language: .swift(),
                           layout: CodeEditor.LayoutConfiguration(showMinimap: showMinimap, wrapText: wrapText))
                .environment(\.codeEditorTheme, Theme.defaultDark)
                .focused($editorIsFocused)
            }.toolbar {
                HStack {
                    Link("Documentation", destination: URL(string: "https://cherrilang.org/language/")!)
                    Button("Config", systemImage: "gear", action: {
                        self.showPopover = true
                    }).popover(isPresented: $showPopover, content: {
                        VStack(alignment: .leading) {
                            Toggle("Show Minimap", isOn: $showMinimap)
                                .toggleStyle(.checkbox)
                                .padding(2)
                            Toggle("Wrap Text", isOn: $wrapText)
                                .toggleStyle(.checkbox)
                                .padding(2)
                        }.padding()
                    })
                    Button("Build", systemImage: "hammer", action: compileFile)
                        .buttonStyle(.automatic)
                }
            }
        }.frame(minWidth: 300, minHeight: 600)
    }
    
    func compileFile() {
        let process = Process()
        
        let bundle = Bundle.main
        process.executableURL = bundle.url(forResource: "cherri_binary", withExtension: "")
        process.arguments = [fileURL.relativePath, "--no-ansi", "-i"]
        
        let pipe = Pipe()
        process.standardInput = nil
        process.standardOutput = pipe
        process.standardError = pipe
        
        process.launch()
        
        let data = pipe.fileHandleForReading.readDataToEndOfFile()
        let output = String(data: data, encoding: .utf8)!
        
        handleCompilerOutput(output: output)
    }
    
    func handleCompilerOutput(output: String) {
        var message = output
        var summary = "Message"
        var category: Message.Category
        if output.contains("Error:") {
            category = Message.Category.error
            message = message.replacingOccurrences(of: "Error: ", with: "")
            summary = "Error"
        } else if output.contains("Warning:") {
            category = Message.Category.warning
            message = message.replacingOccurrences(of: "Warning: ", with: "")
            summary = "Warning"
        } else {
            return
        }
        
        let lineColSearch = /(\d+):(\d+)/
        var line = "1"
        var col = "1"
        if let result = try? lineColSearch.firstMatch(in: output) {
            line = "\(result.1)"
            col = "\(result.2)"
            
            let replaceLineCol = "("+line+":"+col+")"
            message = message.replacingOccurrences(of: replaceLineCol, with: "")
        }
        
        message = message.trimmingCharacters(in: NSCharacterSet.whitespacesAndNewlines)
        
        messages.removeAll()

        messages.insert(TextLocated(location: TextLocation(oneBasedLine: Int(line) ?? 1, column: Int(col) ?? 1),
                                    entity: Message(category: category,
                                                    length: 1,
                                                    summary: "\(summary )",
                                                    description: NSAttributedString(string: message))))
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(document: .constant(CherriDocument(text: "")), fileURL: URL(filePath: "")!)
            .preferredColorScheme(.dark)
    }
}
