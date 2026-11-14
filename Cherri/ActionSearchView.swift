//
//  ActionSearchView.swift
//  Cherri
//

import SwiftUI

/// A quick-open panel that searches every action the compiler documents.
struct ActionSearchView: View {
    let onInsert: (CherriActionEntry) -> Void
    let onDismiss: () -> Void
    var loadContents: () async throws -> CherriActionRegistry.Contents = { try await CherriActionRegistry.shared.contents() }

    private enum LoadState {
        case loading
        case loaded(CherriActionRegistry.Contents)
        case failed(String)
    }

    @State private var loadState: LoadState = .loading
    @State private var query = ""
    @State private var selectedCategoryName: String?
    @State private var selectedSubcategory: String?
    @State private var selectedIdentifier: String?
    @State private var identifierShowingInfo: String?
    @FocusState private var searchFieldIsFocused: Bool

    private static let panelShape = RoundedRectangle(cornerRadius: 12, style: .continuous)

    var body: some View {
        VStack(spacing: 0) {
            searchField
            Divider()
            categoryBar
            Divider()
            content
        }
        .frame(width: 520, height: 420)
        .background(.regularMaterial)
        .clipShape(Self.panelShape)
        .overlay(Self.panelShape.strokeBorder(.separator))
        .shadow(radius: 20)
        .task { await load() }
        .onAppear { searchFieldIsFocused = true }
        .onExitCommand(perform: onDismiss)
        .onChange(of: visibleEntries.map(\.id)) { selectedIdentifier = visibleEntries.first?.id }
        .onChange(of: selectedCategoryName) { selectedSubcategory = nil }
    }

    private var contents: CherriActionRegistry.Contents? {
        guard case .loaded(let contents) = loadState else { return nil }
        return contents
    }

    private var visibleEntries: [CherriActionEntry] {
        guard let contents else { return [] }
        let entriesInSelectedCategory = contents.entries.filter { entry in
            guard let selectedCategoryName else { return true }
            guard entry.category?.name == selectedCategoryName else { return false }
            guard let selectedSubcategory else { return true }
            return entry.subcategory == selectedSubcategory
        }
        return ActionSearchRanker.rank(entriesInSelectedCategory, matching: query)
    }

    private var subcategoriesOfSelectedCategory: [String] {
        contents?.categories.first { $0.name == selectedCategoryName }?.subcategories ?? []
    }

    // MARK: Header

    private var searchField: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(.secondary)
            TextField("Search actions", text: $query)
                .textFieldStyle(.plain)
                .font(.title3)
                .focused($searchFieldIsFocused)
                .onSubmit(insertSelectedEntry)
                .onKeyPress(.upArrow) { moveSelection(by: -1) }
                .onKeyPress(.downArrow) { moveSelection(by: 1) }
        }
        .padding(12)
    }

    @ViewBuilder
    private var categoryBar: some View {
        if let contents {
            HStack(spacing: 8) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        categoryChip("All", isSelected: selectedCategoryName == nil) {
                            selectedCategoryName = nil
                        }
                        ForEach(contents.categories, id: \.name) { category in
                            categoryChip(category.title, isSelected: selectedCategoryName == category.name) {
                                selectedCategoryName = category.name
                            }
                        }
                    }
                    .padding(.horizontal, 12)
                }
                subcategoryMenu
                    .padding(.trailing, 12)
            }
            .padding(.vertical, 8)
        }
    }

    private func categoryChip(_ title: String, isSelected: Bool, select: @escaping () -> Void) -> some View {
        Toggle(title, isOn: Binding(get: { isSelected }, set: { _ in select() }))
            .toggleStyle(.button)
            .buttonBorderShape(.capsule)
            .controlSize(.small)
            .tint(.accentColor)
    }

    @ViewBuilder
    private var subcategoryMenu: some View {
        if !subcategoriesOfSelectedCategory.isEmpty {
            Picker("Subcategory", selection: $selectedSubcategory) {
                Text("All subcategories").tag(String?.none)
                ForEach(subcategoriesOfSelectedCategory, id: \.self) { subcategory in
                    Text(subcategory).tag(Optional(subcategory))
                }
            }
            .labelsHidden()
            .controlSize(.small)
            .fixedSize()
        }
    }

    // MARK: Results

    @ViewBuilder
    private var content: some View {
        switch loadState {
        case .loading:
            ProgressView()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        case .failed(let message):
            ContentUnavailableView("Unable to load actions",
                                   systemImage: "exclamationmark.triangle",
                                   description: Text(message))
        case .loaded:
            resultsList
        }
    }

    private var resultsList: some View {
        ScrollViewReader { proxy in
            List(visibleEntries, selection: $selectedIdentifier) { entry in
                row(for: entry)
            }
            .listStyle(.inset)
            .scrollContentBackground(.hidden)
            .contextMenu(forSelectionType: String.self) { _ in
            } primaryAction: { _ in
                insertSelectedEntry()
            }
            .overlay {
                if visibleEntries.isEmpty {
                    ContentUnavailableView.search(text: query)
                }
            }
            .onChange(of: selectedIdentifier) {
                guard let selectedIdentifier else { return }
                proxy.scrollTo(selectedIdentifier)
            }
        }
    }

    private func row(for entry: CherriActionEntry) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.action.identifier)
                    .font(.body.monospaced())
                Text(entry.action.summary.isEmpty ? entry.action.title : entry.action.summary)
                    .font(.callout)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
            Spacer()
            Button {
                identifierShowingInfo = identifierShowingInfo == entry.id ? nil : entry.id
            } label: {
                Image(systemName: "info.circle")
            }
            .buttonStyle(.borderless)
            .keyboardShortcut(entry.id == selectedIdentifier ? KeyboardShortcut("i", modifiers: .command) : nil)
            .help("Show details")
            .accessibilityLabel("Details for \(entry.action.identifier)")
            .popover(isPresented: isShowingInfo(for: entry), arrowEdge: .trailing) {
                ActionInfoView(entry: entry)
            }
        }
    }

    private func isShowingInfo(for entry: CherriActionEntry) -> Binding<Bool> {
        Binding(get: { identifierShowingInfo == entry.id },
                set: { if !$0 { identifierShowingInfo = nil } })
    }

    // MARK: Actions

    private func load() async {
        do {
            loadState = .loaded(try await loadContents())
        } catch {
            loadState = .failed(error.localizedDescription)
        }
    }

    private func insertSelectedEntry() {
        guard let entry = visibleEntries.first(where: { $0.id == selectedIdentifier }) else { return }
        onInsert(entry)
    }

    /// A list cannot receive arrow keys while the search field has focus, so the field moves the selection.
    private func moveSelection(by offset: Int) -> KeyPress.Result {
        let identifiers = visibleEntries.map(\.id)
        guard !identifiers.isEmpty else { return .handled }
        let currentIndex = selectedIdentifier.flatMap(identifiers.firstIndex(of:)) ?? 0
        selectedIdentifier = identifiers[min(max(currentIndex + offset, 0), identifiers.count - 1)]
        return .handled
    }
}

private struct ActionInfoView: View {
    let entry: CherriActionEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ActionDocumentation(action: entry.action)
            if let includePath = entry.category?.includePath {
                Text("Needs #include '\(includePath)', which is added automatically when you insert this action.")
                    .font(.callout)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(width: 360, alignment: .leading)
        .padding(12)
    }
}

#Preview {
    let device = CherriActionCategory(name: "device", title: "Device", includePath: "actions/device", subcategories: ["Battery", "Display"])
    let text = CherriActionCategory(name: "text", title: "Text", includePath: "actions/text", subcategories: [])

    func entry(_ identifier: String, _ title: String, _ summary: String, category: CherriActionCategory?, subcategory: String? = nil) -> CherriActionEntry {
        CherriActionEntry(action: CherriAction(identifier: identifier,
                                               title: title,
                                               summary: summary,
                                               definition: "\(identifier)(text value)",
                                               signature: "\(identifier)(text value)",
                                               notes: ["Requires version 17 or later."]),
                          category: category,
                          subcategory: subcategory)
    }

    return ActionSearchView(onInsert: { _ in }, onDismiss: {}) {
        CherriActionRegistry.Contents(
            categories: [device, text],
            entries: [
                entry("define", "Define", "Returns the definition of the word.", category: text),
                entry("lockScreen", "Lock Screen", "Lock the device screen.", category: device, subcategory: "Display"),
                entry("setChargeLimit", "Charge Limit", "Set the battery charge limit.", category: device, subcategory: "Battery"),
                entry("rawAction", "rawAction()", "", category: nil),
            ]
        )
    }
    .padding(40)
}
