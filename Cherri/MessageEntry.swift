//
//  MessageEntry.swift
//  Cherri
//
//  Created by Brandon Jordan on 3/7/25.
//

import Foundation
import LanguageSupport
import SwiftUI

struct MessageEntry {
    @Binding var messages: Set<TextLocated<Message>>
    
    @Environment(\.presentationMode) private var presentationMode
    
    @State private var category:  Message.Category = .error
    @State private var summary:   String           = ""
    @State private var lineStr:   String           = ""
    @State private var columnStr: String           = ""
    @State private var message:   String           = ""
}
