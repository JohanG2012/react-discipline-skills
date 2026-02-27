#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_BRIDGE_DIR="$SCRIPT_DIR/speckit-rules-bridge"
TARGET_REPO="$(pwd)"
BRIDGE_DIR="$DEFAULT_BRIDGE_DIR"
TRY_ENABLE="true"

usage() {
  cat <<'USAGE'
Install Spec Kit rules-bridge clarify extension.

Usage:
  bridge/install-speckit-clarify-bridge.sh [options]

Options:
  --target-repo <path>   Target repository where Spec Kit is initialized
                         (default: current directory)
  --bridge-dir <path>    Path to local extension directory
                         (default: bridge/speckit-rules-bridge)
  --no-enable            Skip explicit `specify extension enable`
  -h, --help             Show this help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target-repo)
      TARGET_REPO="${2:-}"
      shift 2
      ;;
    --bridge-dir)
      BRIDGE_DIR="${2:-}"
      shift 2
      ;;
    --no-enable)
      TRY_ENABLE="false"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! command -v specify >/dev/null 2>&1; then
  echo "Error: 'specify' CLI is not available on PATH." >&2
  exit 1
fi

if [[ ! -d "$TARGET_REPO" ]]; then
  echo "Error: target repo does not exist: $TARGET_REPO" >&2
  exit 1
fi

if [[ ! -f "$BRIDGE_DIR/extension.yml" ]]; then
  echo "Error: extension manifest not found at $BRIDGE_DIR/extension.yml" >&2
  exit 1
fi

if [[ ! -d "$TARGET_REPO/.specify" ]]; then
  echo "Error: target repo is missing .specify/ (run spec kit init first)." >&2
  exit 1
fi

BRIDGE_DIR_ABS="$(cd "$BRIDGE_DIR" && pwd)"
TARGET_REPO_ABS="$(cd "$TARGET_REPO" && pwd)"

echo "Installing rules-bridge extension into: $TARGET_REPO_ABS"
(
  cd "$TARGET_REPO_ABS"
  specify extension add rules-bridge --dev "$BRIDGE_DIR_ABS"
)

if [[ "$TRY_ENABLE" == "true" ]]; then
  if (
    cd "$TARGET_REPO_ABS" &&
    specify extension enable rules-bridge >/dev/null 2>&1
  ); then
    echo "Extension enabled: rules-bridge"
  else
    echo "Note: explicit enable step was skipped/unsupported; continuing."
  fi
fi

cat <<EOF

Installed local extension: rules-bridge
Extension source: $BRIDGE_DIR_ABS
Target repository: $TARGET_REPO_ABS

Run in target repo:
  /speckit.rules-bridge.clarify

EOF
