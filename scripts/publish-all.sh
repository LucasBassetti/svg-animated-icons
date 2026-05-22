#!/usr/bin/env bash
# Build and publish every public @svg-animated-icons/* package in one go.
#
# Usage:
#   bash scripts/publish-all.sh
#   bash scripts/publish-all.sh --skip-build
#
# Angular publishes from packages/angular/dist/ (ng-packagr writes the real
# package.json there, see publishConfig.directory in packages/angular/package.json).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SKIP_BUILD=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build) SKIP_BUILD=1; shift ;;
    -h|--help)
      sed -n '2,9p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 64 ;;
  esac
done

if grep -q 'DEFAULT_REGISTRY = "http://localhost' packages/cli/src/registry.ts; then
  cat >&2 <<'WARN'

  ⚠️  The CLI's DEFAULT_REGISTRY in packages/cli/src/registry.ts still points at
     http://localhost:3000. End users running

         npx @svg-animated-icons/cli add <icon> --<framework>

     will get a connection-refused error unless they pass --registry <url> or
     set $SVG_ICONS_REGISTRY. Publishing the CLI in this state ships a default
     that does not work out of the box.

WARN
  read -r -p "  Type 'yes' to publish the CLI anyway: " confirm
  if [[ "$confirm" != "yes" ]]; then
    echo "  Aborted." >&2
    exit 1
  fi
fi

if [[ -z "$SKIP_BUILD" ]]; then
  echo "==> building all four packages"
  pnpm exec turbo run build \
    --filter=@svg-animated-icons/cli \
    --filter=@svg-animated-icons/react \
    --filter=@svg-animated-icons/vue \
    --filter=@svg-animated-icons/angular
fi

publish_via_pnpm() {
  local pkg="$1"
  echo "==> publishing @svg-animated-icons/$pkg"
  pnpm --filter "@svg-animated-icons/$pkg" publish \
    --no-git-checks --access public
}

publish_via_pnpm react
publish_via_pnpm vue

echo "==> publishing @svg-animated-icons/angular (from packages/angular/dist)"
( cd packages/angular/dist && npm publish --access public )

publish_via_pnpm cli

echo
echo "✓ Published @svg-animated-icons/{react,vue,angular,cli}"
echo "  Check: https://www.npmjs.com/org/svg-animated-icons"
