#!/usr/bin/env bash
# Deploys already-built apps to a DHIS2 server. Asks for the server and credentials once.
# Usage: ./deploy.sh <app folder>...   e.g. ./deploy.sh global-shell-app
# Build each app first (yarn build in its folder).
set -euo pipefail
cd "$(dirname "$0")"

if [ $# -eq 0 ]; then
    echo "Usage: ./deploy.sh <app folder>..." >&2
    exit 1
fi

read -rp "Server URL (e.g. https://play.im.dhis2.org/dev): " SERVER
read -rp "Username for $SERVER: " username
read -rsp "Password: " D2_PASSWORD
echo
export D2_PASSWORD

for app in "$@"; do
    echo
    echo "== Deploying $app"
    (cd "$app" && yarn -s d2-app-scripts deploy "$SERVER" -u "$username")
done

echo
echo "Deployed: $*"
