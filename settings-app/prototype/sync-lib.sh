#!/usr/bin/env bash
# Copies the shared app settings library from the System Settings prototype
# into each app fork. The copy in settings-app is the only one to edit.
set -euo pipefail
cd "$(dirname "$0")"
SOURCE=settings-app/src/app-settings-lib/

for app in dashboard-app settings-catalogue-app workspace-builder-app; do
    rsync -a --delete --exclude '*.test.js' --exclude '*.test.jsx' \
        "$SOURCE" "$app/src/app-settings-lib/"
    echo "Synced library into $app"
done

# The global shell only reads descriptions: copy just what it imports.
rsync -a --delete \
    --include 'parseDescription.js' \
    --include 'validateValue.js' \
    --include 'permissions.js' \
    --include 'discoverAppSettings.js' \
    --exclude '*' \
    "$SOURCE" global-shell-app/src/app-settings-lib/
echo "Synced library into global-shell-app"
