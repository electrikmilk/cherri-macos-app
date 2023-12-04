//
//  CherriDocument.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/3/23.
//

import SwiftUI
import UniformTypeIdentifiers

extension UTType {
    static var cherriSource: UTType {
        UTType(importedAs: "org.cherrilang.cherri.file")
    }
}

struct CherriDocument: FileDocument {
    var text: String

    init(text: String = "alert(\"Hello, Cherri!\")") {
        self.text = text
    }

    static var readableContentTypes: [UTType] { [.cherriSource] }

    init(configuration: ReadConfiguration) throws {
        guard let data = configuration.file.regularFileContents,
              let string = String(data: data, encoding: .utf8)
        else {
            throw CocoaError(.fileReadCorruptFile)
        }
        text = string
    }
    
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        let data = text.data(using: .utf8)!
        return .init(regularFileWithContents: data)
    }
}
