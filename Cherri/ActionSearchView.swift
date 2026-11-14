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
    @State private var chipRowWidth: CGFloat = 0
    /// Chip frames inside the scrolling content, so they do not change as the row scrolls.
    @State private var chipFrames: [String: CGRect] = [:]
    @State private var openedCategoryChipFrame: CGRect?
    @Namespace private var chipNamespace
    @State private var selectedSubcategory: String?
    @State private var selectedIdentifier: String?
    @State private var identifierShowingInfo: String?
    @FocusState private var searchFieldIsFocused: Bool
    @Environment(\.controlActiveState) private var controlActiveState

    private var windowIsActive: Bool { controlActiveState != .inactive }

    private static let allChipID = "all"
    private static let backButtonID = "back"
    private static let rowStartID = "rowStart"
    private static let chipContentSpace = "chipContent"
    private static let chipRowMargin: CGFloat = 12

    private static let categoryChipIDPrefix = "category:"

    private static func chipID(ofCategoryNamed name: String) -> String {
        "\(categoryChipIDPrefix)\(name)"
    }

    private static func chipID(ofSubcategory name: String) -> String {
        "subcategory:\(name)"
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
            ScrollViewReader { proxy in
                glassContainer {
                    if let selectedCategory = contents.categories.first(where: { $0.name == selectedCategoryName }) {
                        subcategoryBar(for: selectedCategory)
                    } else {
                        categoryRow(contents.categories)
                    }
                }
                .onGeometryChange(for: CGFloat.self) { $0.size.width } action: { chipRowWidth = $0 }
                .onChange(of: selectedCategoryName) { previousName, newName in
                    scrollCategoryRow(proxy, fromCategoryNamed: previousName, toCategoryNamed: newName)
                }
            }
            .animation(.smooth(duration: 0.35), value: selectedCategoryName)
            .animation(.snappy, value: selectedSubcategory)
            .padding(.vertical, 8)
        }
    }

    private func categoryRow(_ categories: [CherriActionCategory]) -> some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
                Color.clear
                    .frame(width: 1, height: 1)
                    .id(Self.rowStartID)
                HStack(spacing: 6) { categoryChips(of: categories) }
                    .coordinateSpace(name: Self.chipContentSpace)
                    .padding(.horizontal, Self.chipRowMargin)
            }
        }
    }

    /// The back button and the chip for the whole category stay put, and only the subcategories scroll. Glass is drawn per
    /// container, so the scrolling chips get a container of their own inside the scroll view, where the scroll view clips them.
    private func subcategoryBar(for category: CherriActionCategory) -> some View {
        HStack(spacing: 0) {
            HStack(spacing: 6) {
                backButton(to: "all categories from \(category.title)")
                chip(category.title, id: Self.chipID(ofCategoryNamed: category.name), isSelected: selectedSubcategory == nil) {
                    selectedSubcategory = nil
                }
                if !category.subcategories.isEmpty {
                    Divider()
                        .frame(height: 16)
                }
            }
            .padding(.leading, Self.chipRowMargin)
            .padding(.trailing, 6)
            if !category.subcategories.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    glassContainer {
                        HStack(spacing: 6) {
                            ForEach(category.subcategories.map { (id: Self.chipID(ofSubcategory: $0), name: $0) }, id: \.id) { id, subcategory in
                                chip(subcategory, id: id, isSelected: selectedSubcategory == subcategory) {
                                    selectedSubcategory = subcategory
                                }
                            }
                        }
                    }
                    .padding(.trailing, Self.chipRowMargin)
                }
                .clipped()
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
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
        ForEach(categories.map { (id: Self.chipID(ofCategoryNamed: $0.name), category: $0) }, id: \.id) { id, category in
            chip(category.title, id: id, isSelected: false) {
                openedCategoryChipFrame = chipFrames[id]
                selectedCategoryName = category.name
            }
        }
    }

    private func closeCategory() {
        selectedCategoryName = nil
    }

    /// Runs in the update after the swap, because the row is still short in the update that swaps it and a position
    /// further right than that would be clamped to the left. Going back centers the category that was open when it lies
    /// past the first screenful of chips, and otherwise starts at the left.
    /// Scrolling by id with a proxy rather than a bound position, because a bound position ignores a target equal to its current value.
    private func scrollCategoryRow(_ proxy: ScrollViewProxy, fromCategoryNamed previousName: String?, toCategoryNamed newName: String?) {
        guard newName == nil else { return }
        let isPastFirstScreenful = openedCategoryChipFrame.map { $0.maxX + Self.chipRowMargin > chipRowWidth } ?? false
        withAnimation(.smooth(duration: 0.35)) {
            if isPastFirstScreenful, let previousName {
                proxy.scrollTo(Self.chipID(ofCategoryNamed: previousName), anchor: .center)
            } else {
                proxy.scrollTo(Self.rowStartID, anchor: .leading)
            }
        }
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

    private func chip(_ title: String, id: String, isSelected: Bool, select: @escaping () -> Void) -> some View {
        chipBody(title, id: id, isSelected: isSelected, select: select)
            .onGeometryChange(for: CGRect.self) { $0.frame(in: .named(Self.chipContentSpace)) } action: { recordCategoryRowFrame($0, ofChip: id) }
    }

    /// Only the category row's own layout is wanted, and writing state for chips that move during the morph would update the glass every frame.
    private func recordCategoryRowFrame(_ frame: CGRect, ofChip id: String) {
        guard selectedCategoryName == nil, id.hasPrefix(Self.categoryChipIDPrefix) else { return }
        chipFrames[id] = frame
    }

    @ViewBuilder
    private func chipBody(_ title: String, id: String, isSelected: Bool, select: @escaping () -> Void) -> some View {
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
