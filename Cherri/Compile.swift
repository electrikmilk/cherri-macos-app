//
//  Compile.swift
//  Cherri
//
//  Created by Brandon Jordan on 12/3/23.
//

import Foundation

class Compile {
    init() {
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
}
