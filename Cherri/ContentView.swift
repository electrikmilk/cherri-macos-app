//
//  ContentView.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/3/23.
//

import SwiftUI

import LanguageSupport
import CodeEditorView

struct MessageEntry: View {
    @Binding var messages: Set<TextLocated<Message>>
    
    @Environment(\.presentationMode) private var presentationMode
    
    @State private var category:  Message.Category = .error
    @State private var summary:   String           = ""
    @State private var lineStr:   String           = ""
    @State private var columnStr: String           = ""
    @State private var message:   String           = ""
    
    var body: some View {
        VStack(spacing: 16) {
            
            Text("Enter a message to display in the code view")
            
            Form {
                
                Section(header: Text("Essentials")) {
                    
                    Picker("", selection: $category) {
                        Text("Live").tag(Message.Category.live)
                        Text("Error").tag(Message.Category.error)
                        Text("Warning").tag(Message.Category.warning)
                        Text("Informational").tag(Message.Category.informational)
                    }
                    .padding([.top, .bottom], 4)
                    
                    TextField("Summary", text: $summary)
                    
#if os(iOS)
                    HStack {
                        TextField("Line", text: $lineStr)
                        TextField("Column", text: $columnStr)
                    }
#elseif os(macOS)
                    TextField("Line", text: $lineStr)
                    TextField("Column", text: $columnStr)
#endif
                    Text("Line and column numbers start at 1.")
                        .font(.system(.footnote))
#if os(macOS)
                        .padding([.bottom], 8)
#endif
                    
                }
                
                Section(header: Text("Detailed message")) {
                    TextEditor(text: $message)
                        .frame(height: 100)
                }
                
            }
            HStack {
                
                Button("Cancel"){ presentationMode.wrappedValue.dismiss() }
                    .keyboardShortcut(.cancelAction)
                
                Spacer()
                
                Button("Submit message"){
                    
                    let finalSummary = summary.count == 0 ? "Summary" : summary,
                        line         = Int(lineStr) ?? 1,
                        column       = Int(columnStr) ?? 1
                    messages.insert(TextLocated(location: TextLocation(oneBasedLine: line, column: column),
                                                entity: Message(category: category,
                                                                length: 1,
                                                                summary: finalSummary,
                                                                description: NSAttributedString(string: message))))
                    presentationMode.wrappedValue.dismiss()
                    
                }
                .keyboardShortcut(.defaultAction)
                
            }
        }
        .padding(10)
    }
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
                    Button("Add Message") { showMessageEntry = true }
                        .sheet(isPresented: $showMessageEntry){ MessageEntry(messages: $messages) }
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
        
        print(output)
    }
}

struct MessageEntry_Previews: PreviewProvider {
    
    struct Container: View {
        @State var messages: Set<TextLocated<Message>> = Set()
        
        var body: some View {
            MessageEntry(messages: $messages)
                .preferredColorScheme(.dark)
        }
    }
    
    static var previews: some View { Container() }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(document: .constant(CherriDocument(text: "")), fileURL: URL(filePath: "")!)
            .preferredColorScheme(.dark)
    }
}
