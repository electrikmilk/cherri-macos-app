//
//  CherriSettings.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/13/23.
//

import SwiftUI

struct CherriSettings: View {
    @AppStorage("Cherri.theme")
    private var theme: ContentView.CodeTheme = .dark
    
    @AppStorage("Cherri.shareWith")
    private var shareWith: ContentView.ShareOption = .contacts
    
    @AppStorage("Cherri.showMinimap")
    private var showMinimap: Bool                  = true
    
    @AppStorage("Cherri.wrapText")
    private var wrapText:    Bool                  = true
    
    var body: some View {
        Form {
            Picker("Editor Theme:", selection: $theme) {
                ForEach(ContentView.CodeTheme.allCases) { level in
                    Text(level.rawValue)
                }
            }
            .pickerStyle(.menu)
            Picker("Share compiled Shortcuts with:", selection: $shareWith) {
                ForEach(ContentView.ShareOption.allCases) { level in
                    Text(level.rawValue)
                }
            }
            .pickerStyle(.menu)
            Toggle("Show Minimap", isOn: $showMinimap)
                .toggleStyle(.checkbox)
                .padding(2)
            Toggle("Wrap Text", isOn: $wrapText)
                .toggleStyle(.checkbox)
                .padding(2)
        }
        .frame(width: 300)
        .navigationTitle("Cherri Settings")
        .padding(80)
    }
}

#Preview {
    CherriSettings()
}
