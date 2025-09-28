//
//  AboutView.swift
//  Cherri
//
//  Created by Brandon Jordan on 1/16/24.
//

import Foundation
import SwiftUI

struct AboutView: View {
    var body: some View {
        VStack(spacing: 8) {
            Image(nsImage: NSImage(named: "Icon")!)
                .scaleEffect(x: 0.5, y: 0.5, anchor: .center)
                .frame(maxWidth: 64, maxHeight: 64)
            
            Text("\(Bundle.main.appName)")
                .font(.system(size: 15, weight: .bold))
                .textSelection(.enabled)
            
            Text("Version \(Bundle.main.appVersionLong) (\(Bundle.main.appBuild))")
                .font(.system(size: 10))
                .textSelection(.enabled)
            
            Divider()
            
            Link("Learn more at cherrilang.org", destination: URL(string: "https://cherrilang.org/")!)
        }
        .frame(minWidth: 280, minHeight: 170)
    }
}

extension Bundle {
    public var appName: String { getInfo("CFBundleName")  }
    public var appBuild: String { getInfo("CFBundleVersion") }
    public var appVersionLong: String { getInfo("CFBundleShortVersionString") }
    
    fileprivate func getInfo(_ str: String) -> String { infoDictionary?[str] as? String ?? "⚠️" }
}
