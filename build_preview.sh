#!/bin/sh
set -e

PATH=/usr/bin:/usr/local/bin:/opt/local/bin:/bin:/opt/homebrew/bin:$PATH
hash -r yarn
hash -r cp

PREVIEW_SHORTCUT_DIR="${PREVIEW_SHORTCUT_DIR:-$HOME/preview-shortcut}"

if [ ! -d "$PREVIEW_SHORTCUT_DIR" ]; then
    echo "preview-shortcut not found at $PREVIEW_SHORTCUT_DIR (set PREVIEW_SHORTCUT_DIR to override)" >&2
    exit 1
fi

(cd "$PREVIEW_SHORTCUT_DIR" && yarn install --frozen-lockfile && yarn build)

cp "$PREVIEW_SHORTCUT_DIR/dist/main.mjs" Cherri/Preview/main.mjs
cp "$PREVIEW_SHORTCUT_DIR/dist/main.css" Cherri/Preview/main.css
