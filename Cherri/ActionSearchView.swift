//
//  ActionSearchView.swift
//  Cherri
//

import SwiftUI

/// A quick-open panel that searches every action the compiler documents.
struct ActionSearchView: View {
    let onInsert: (CherriActionEntry) -> Void
    var loadContents: () async throws -> CherriActionRegistry.Contents = { try await CherriActionRegistry.shared.contents() }

    private enum LoadState {
        case loading
        case loaded(CherriActionRegistry.Contents)
        case failed(String)
    }

    @State private var loadState: LoadState = .loading
    @State private var query = ""
    @State private var selectedCategoryName: String?
    @State private var chipScrollTarget: String?
    /// Where the category row was scrolled to before a category was opened.
    @State private var categoryRowScrollTarget: String?
    @Namespace private var chipNamespace
    @State private var selectedSubcategory: String?
    @State private var selectedIdentifier: String?
    @State private var identifierShowingInfo: String?
    @FocusState private var searchFieldIsFocused: Bool
    @Environment(\.controlActiveState) private var controlActiveState

    private var windowIsActive: Bool { controlActiveState != .inactive }

    private static let allChipID = "all"
    private static let backButtonID = "back"

    private static func chipID(of category: CherriActionCategory) -> String {
        "category:\(category.name)"
    }

    var body: some View {
        VStack(spacing: 0) {
            searchField
            Divider()
            categoryBar
            Divider()
            content
        }
        .frame(width: 520, height: 420)
        .task { await load() }
        .onAppear { searchFieldIsFocused = true }
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
            ScrollView(.horizontal, showsIndicators: false) {
                glassContainer {
                    HStack(spacing: 6) {
                        if let selectedCategory = contents.categories.first(where: { $0.name == selectedCategoryName }) {
                            subcategoryChips(of: selectedCategory)
                        } else {
                            categoryChips(of: contents.categories)
                        }
                    }
                    .scrollTargetLayout()
                }
            }
            .contentMargins(.horizontal, 12, for: .scrollContent)
            .scrollPosition(id: $chipScrollTarget, anchor: .leading)
            .animation(.smooth(duration: 0.35), value: selectedCategoryName)
            .animation(.snappy, value: selectedSubcategory)
            .padding(.vertical, 8)
        }
    }

    /// Chips share one glass container so a tapped category morphs into the chip that names it in the subcategory row.
    @ViewBuilder
    private func glassContainer<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        if #available(macOS 26, *) {
            GlassEffectContainer(spacing: 6, content: content)
        } else {
            content()
        }
    }

    @ViewBuilder
    private func categoryChips(of categories: [CherriActionCategory]) -> some View {
        chip("All", id: Self.allChipID, isSelected: true) {}
        ForEach(categories, id: \.name) { category in
            chip(category.title, id: Self.chipID(of: category), isSelected: false) {
                open(category)
            }
        }
    }

    @ViewBuilder
    private func subcategoryChips(of category: CherriActionCategory) -> some View {
        backButton(to: "all categories from \(category.title)")
        chip(category.title, id: Self.chipID(of: category), isSelected: selectedSubcategory == nil) {
            selectedSubcategory = nil
        }
        if !category.subcategories.isEmpty {
            Divider()
                .frame(height: 16)
                .id("divider")
            ForEach(category.subcategories, id: \.self) { subcategory in
                chip(subcategory, id: "subcategory:\(subcategory)", isSelected: selectedSubcategory == subcategory) {
                    selectedSubcategory = subcategory
                }
            }
        }
    }

    /// The category row's scroll position is restored on the way back, and the subcategory row always starts at the left.
    private func open(_ category: CherriActionCategory) {
        categoryRowScrollTarget = chipScrollTarget
        chipScrollTarget = Self.backButtonID
        selectedCategoryName = category.name
    }

    private func closeCategory() {
        selectedCategoryName = nil
        chipScrollTarget = categoryRowScrollTarget
    }

    @ViewBuilder
    private func backButton(to destination: String) -> some View {
        if #available(macOS 26, *) {
            Button(action: closeCategory) {
                Image(systemName: "chevron.left")
                    .fontWeight(.semibold)
                    .frame(width: 28, height: 28)
                    .contentShape(Circle())
            }
            .buttonStyle(.plain)
            .glassEffect(.regular.interactive(), in: .circle)
            .glassEffectID(Self.backButtonID, in: chipNamespace)
            .id(Self.backButtonID)
            .help("Back to \(destination)")
            .accessibilityLabel("Back")
        } else {
            Button(action: closeCategory) {
                Image(systemName: "chevron.left")
            }
            .buttonStyle(.borderless)
            .id(Self.backButtonID)
            .help("Back to \(destination)")
            .accessibilityLabel("Back")
        }
    }

    @ViewBuilder
    private func chip(_ title: String, id: String, isSelected: Bool, select: @escaping () -> Void) -> some View {
        if #available(macOS 26, *) {
            glassChip(title, id: id, isSelected: isSelected, select: select)
        } else {
            Toggle(title, isOn: Binding(get: { isSelected }, set: { _ in select() }))
                .toggleStyle(.button)
                .buttonBorderShape(.capsule)
                .controlSize(.small)
                .tint(.accentColor)
                .id(id)
        }
    }

    @available(macOS 26, *)
    private func glassChip(_ title: String, id: String, isSelected: Bool, select: @escaping () -> Void) -> some View {
        Button(action: select) {
            Text(title)
                .padding(.horizontal, 14)
                .padding(.vertical, 6)
                .foregroundStyle(isSelected ? Color.white : Color.primary)
                .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .glassEffect(isSelected ? .regular.tint(.accentColor).interactive() : .regular.interactive(), in: .capsule)
        .glassEffectID(id, in: chipNamespace)
        .id(id)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
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
            List(visibleEntries) { entry in
                row(for: entry)
                    .listRowBackground(selectionBackground(isSelected: entry.id == selectedIdentifier))
                    .contentShape(Rectangle())
                    .onTapGesture(count: 2) {
                        selectedIdentifier = entry.id
                        insertSelectedEntry()
                    }
                    .onTapGesture { selectedIdentifier = entry.id }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
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

    /// The list's own selection turns gray while the search field has focus, so the selection is drawn here.
    @ViewBuilder
    private func selectionBackground(isSelected: Bool) -> some View {
        if isSelected {
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .fill(windowIsActive ? Color.accentColor : Color(nsColor: .unemphasizedSelectedContentBackgroundColor))
                .padding(.horizontal, 6)
        }
    }

    private func infoButtonTint(isHighlighted: Bool) -> Color {
        guard windowIsActive else { return .secondary }
        return isHighlighted ? .white : .accentColor
    }

    private func row(for entry: CherriActionEntry) -> some View {
        let isSelected = entry.id == selectedIdentifier
        let isHighlighted = isSelected && windowIsActive
        return HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.action.identifier)
                    .font(.body.monospaced())
                    .foregroundStyle(isHighlighted ? Color.white : Color.primary)
                Text(entry.action.summary.isEmpty ? entry.action.title : entry.action.summary)
                    .font(.callout)
                    .foregroundStyle(isHighlighted ? Color.white.opacity(0.8) : Color.secondary)
                    .lineLimit(1)
            }
            Spacer()
            Button {
                identifierShowingInfo = identifierShowingInfo == entry.id ? nil : entry.id
            } label: {
                Image(systemName: "info.circle")
            }
            .buttonStyle(.borderless)
            .tint(infoButtonTint(isHighlighted: isHighlighted))
            .keyboardShortcut(isSelected ? KeyboardShortcut("i", modifiers: .command) : nil)
            .help("Show details")
            .accessibilityLabel("Details for \(entry.action.identifier)")
            .popover(isPresented: isShowingInfo(for: entry), arrowEdge: .trailing) {
                ActionInfoView(entry: entry)
            }
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 10)
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

    return ActionSearchView(onInsert: { _ in }) {
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
