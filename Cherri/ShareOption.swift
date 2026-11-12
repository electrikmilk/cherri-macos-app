//
//  ShareOption.swift
//  Cherri
//
//  Created by Brandon Jordan on 3/5/25.
//

import Foundation

enum ShareOption: String, CaseIterable, Identifiable {
    case contacts = "Contacts"
    case anyone = "Anyone"
    
    var id: ShareOption {
        return self
    }

    var signingMode: String {
        switch self {
        case .contacts:
            return "people-who-know-me"
        case .anyone:
            return "anyone"
        }
    }
}
