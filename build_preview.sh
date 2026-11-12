#!/bin/sh
set -e

PATH=/usr/bin:/usr/local/bin:/opt/local/bin:/bin:/opt/homebrew/bin:$PATH
hash -r git
hash -r yarn
hash -r cp

cd "$(dirname "$0")"

git submodule update --init --recursive Cherri/PreviewShortcut

# Build outside the repo: node_modules is thousands of files, which stalls folders synced by iCloud.
build_directory="$(mktemp -d)"
trap 'rm -rf "$build_directory"' EXIT

cp -R Cherri/PreviewShortcut/. "$build_directory"
(cd "$build_directory" && yarn install --frozen-lockfile && yarn build)

cp "$build_directory/dist/main.mjs" Cherri/Preview/main.mjs
cp "$build_directory/dist/main.css" Cherri/Preview/main.css
