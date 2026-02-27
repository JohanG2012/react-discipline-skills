#!/usr/bin/env bash
set -euo pipefail

TARGET_REPO="$(pwd)"
PURGE_LOCAL="false"

usage() {
  cat <<'USAGE'
Uninstall Spec Kit rules-bridge clarify extension.

Usage:
  bridge/uninstall-speckit-clarify-bridge.sh [options]

Options:
  --target-repo <path>   Target repository where extension is installed
                         (default: current directory)
  --purge-local          Remove known local extension cache dir if present
                         (.specify/extensions/rules-bridge)
  -h, --help             Show this help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target-repo)
      TARGET_REPO="${2:-}"
      shift 2
      ;;
    --purge-local)
      PURGE_LOCAL="true"
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

if [[ ! -d "$TARGET_REPO/.specify" ]]; then
  echo "Error: target repo is missing .specify/ (run spec kit init first)." >&2
  exit 1
fi

TARGET_REPO_ABS="$(cd "$TARGET_REPO" && pwd)"

echo "Uninstalling rules-bridge extension from: $TARGET_REPO_ABS"

(
  cd "$TARGET_REPO_ABS"
  if specify extension disable rules-bridge >/dev/null 2>&1; then
    echo "Extension disabled: rules-bridge"
  else
    echo "Note: disable step skipped/unsupported (continuing)."
  fi

  if specify extension remove rules-bridge >/dev/null 2>&1; then
    echo "Extension removed: rules-bridge"
  else
    echo "Warning: could not remove extension via CLI."
    echo "Run manually in target repo: specify extension remove rules-bridge"
  fi

  if [[ "$PURGE_LOCAL" == "true" ]] && [[ -d ".specify/extensions/rules-bridge" ]]; then
    rm -rf ".specify/extensions/rules-bridge"
    echo "Removed local extension cache: .specify/extensions/rules-bridge"
  fi
)

cat <<EOF

Completed uninstall flow for rules-bridge.
Target repository: $TARGET_REPO_ABS

EOF
