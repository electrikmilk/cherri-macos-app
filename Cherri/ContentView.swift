//
//  ContentView.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/3/23.
//

import SwiftUI

struct ContentView: View {
    @Binding var document: CherriDocument

    var body: some View {
        TextEditor(text: $document.text)
    }
}

#Preview {
    ContentView(document: .constant(CherriDocument()))
}
