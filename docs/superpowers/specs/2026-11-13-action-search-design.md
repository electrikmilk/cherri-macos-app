# Action search design

## Intent

Add a dedicated action search to the Cherri macOS app. It lists actions, lets the user filter them by category, insert one into the code, and open an info popover with the action's full details. Search is fuzzy, matching on both action identifier and description.

## Decided by the user

- Fuzzy search by identifier and description.
- Category filter.
- Insert the selected action into the code.
- Info popover showing full action details.
- Placement: a quick-open overlay on top of the editor.
- The search is separate from autocomplete. Existing autocomplete keeps its prefix matching and is not changed.
- Inserting an action adds its required include line automatically.
- Use the compiler as it is. No change to the Go compiler or the bundled binary.
- Categories come from `--help`: use a regex on the `--docs=` option line to read the category list.
- For each category, run `--docs=<category>`. That output gives all of the actions in that category.
- Load these into a registry, the same way autocomplete loads its actions, dedicated to the search and separate from autocomplete's catalog.

## Findings from the codebase and compiler

- `CherriCatalog.swift` runs the bundled `cherri_binary --action=` and parses the output into `CherriAction` (identifier, title, summary, definition, signature, notes). The result is cached in the `CherriCatalog` actor.
- `--action=` output has no category headers. It is a flat list of `### Title` blocks (433 actions at the time of writing).
- `--docs=<category>` prints one category's actions. There are 25 categories (basic, a11y, calendar, contacts, crypto, device, documents, dropbox, images, location, intelligence, mac, math, media, music, network, pdf, photos, settings, sharing, shortcuts, storage, text, translation, web). The output starts with `# <Name> Actions` and the include statement to use (for example `#include 'actions/text'`). Some categories have `## Subcategory` headers (device has Apps, Battery, Connectivity, Display, Passwords, Personal Hotspot, Screen Time, System). `--subcat=` filters by subcategory.
- The `basic` category says "Actions in this category are automatically included", so it needs no include line.
- `--docs=` with no value lists 429 actions, while `--action=` lists 433. The four extra actions in `--action=` are `rawAction()` and `text()` (compiler built-ins) plus `Base 64 Embed File` and `Make VCard`, which have no category in `--docs=`.
- Titles are not unique. `Play Next` is the title of both `playNext` and `playLater` (music category). `Take Photo` is the title of both `takeVideo` and `takePhoto` (media category). No title is shared across categories, and no action is in more than one category. Titles cannot identify an action, so use the function name in each signature.
- No fuzzy matching exists in the repo. Current autocomplete matching is prefix (substring for glyphs only).
- Autocomplete inserts `name(` when the action takes parameters and `name()` otherwise.
- The app has no popovers or sheets yet. It uses a toolbar, a trailing inspector for the preview, and separate windows.
- The bundled compiler lives in the `Cherri/Compiler` Go submodule.

## Builder's calls (the user has not confirmed these)

- Take each category's include line from its docs header. Parse each docs block from the `--docs=<category>` output (title, description, signature, notes), using the function name in the signature as the action identifier.
- The registry is an actor like `CherriCatalog`, cached after the first load, and it also holds the category list and subcategories.
- The four actions that only `--action=` lists (`rawAction()`, `text()`, `Base 64 Embed File`, `Make VCard`) are not in any `--docs=` category. The user decided they show under "All" and need no include line. Their data comes from the autocomplete catalog (`--action=`), since `--docs=` does not list them.
- Each action belongs to exactly one category, so the include line added is that category's.
- The overlay opens only from a focused document window, so the editor always exists. The menu command is disabled when no document window is focused.
- A keyboard shortcut opens the overlay and Escape closes it. The search field has focus on open. Arrow keys move through results and Return inserts the selected action at the editor cursor, then closes the overlay.
- Category chips with an "All" chip. A second row of chips appears for categories with subcategories.
- Each row shows the identifier and a one-line description.
- An (i) button, or a shortcut, opens a popover with the signature, notes and the include line the action needs.
- Inserted text matches autocomplete: `name(` or `name()`.
- Skip adding an include that is already present in the file, and skip it for the basic category.
- Where the include line is placed in the file.

## Non-goals

- Changing existing autocomplete behavior.

## Open items for the builder

- Choose the fuzzy matching approach and ranking, as long as it matches on identifier and description.
- Pick the exact keyboard shortcut and visual styling, consistent with the existing app.
