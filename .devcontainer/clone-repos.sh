#!/usr/bin/env bash
set -e
cd /workspaces
for repo in platform prototype; do
  [ -d "$repo" ] || gh repo clone "Wright-Terminal/$repo"
done