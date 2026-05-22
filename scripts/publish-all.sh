#!/usr/bin/env bash
# Build and publish every public @svg-animated-icons/* package.
#
# Auth: either an npm automation token in ~/.npmrc (preferred — works with any
# 2FA method including security keys), or a TOTP one-time password via --otp.
# Security-key-only accounts cannot pass --otp; use an automation token.
#
# Set up an automation token:
#   1. https://www.npmjs.com/settings/<username>/tokens → Generate New Token
#      → Classic Token → Automation. Automation tokens bypass 2FA on writes.
#   2. npm config set //registry.npmjs.org/:_authToken=npm_xxx
#
# Usage:
#   pnpm publish:all                       # auth via token in ~/.npmrc
#   pnpm publish:all -- --otp 123456       # auth via TOTP
#   OTP=123456 pnpm publish:all
#   bash scripts/publish-all.sh --skip-build
#
# Angular publishes from packages/angular/dist/ (publishConfig.directory).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

OTP="${OTP:-}"
SKIP_BUILD=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --otp) OTP="$2"; shift 2 ;;
    --otp=*) OTP="${1#*=}"; shift ;;
    --skip-build) SKIP_BUILD=1; shift ;;
    -h|--help) sed -n '2,17p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 64 ;;
  esac
done

HAS_TOKEN=""
if grep -qE '^//registry\.npmjs\.org/:_authToken=' "$HOME/.npmrc" 2>/dev/null; then
  HAS_TOKEN=1
fi

if [[ -z "$HAS_TOKEN" && -z "$OTP" ]]; then
  cat >&2 <<'EOF'
No npm auth available.

Pick one:
  1. Automation token (recommended — works with any 2FA, including security keys):
       https://www.npmjs.com/settings/<username>/tokens
       → Classic Token → Automation
       npm config set //registry.npmjs.org/:_authToken=npm_xxx

  2. TOTP one-time password (only if you have an authenticator app, not just
     a security key):
       bash scripts/publish-all.sh --otp <6-digit-code>

EOF
  exit 64
fi

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
  if [[ -n "$OTP" ]]; then
    pnpm --filter "@svg-animated-icons/$pkg" publish \
      --no-git-checks --access public --otp="$OTP"
  else
    pnpm --filter "@svg-animated-icons/$pkg" publish \
      --no-git-checks --access public
  fi
}

publish_via_npm_dir() {
  local dir="$1"
  echo "==> publishing from $dir"
  if [[ -n "$OTP" ]]; then
    ( cd "$dir" && npm publish --access public --otp="$OTP" )
  else
    ( cd "$dir" && npm publish --access public )
  fi
}

publish_via_pnpm react
publish_via_pnpm vue
publish_via_npm_dir packages/angular/dist
publish_via_pnpm cli

echo
echo "✓ Published @svg-animated-icons/{react,vue,angular,cli}"
echo "  Check: https://www.npmjs.com/org/svg-animated-icons"
