#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_FILE="$ROOT_DIR/seagull-badges-card.js"

HA_HOST="${HA_HOST:-192.168.1.184}"
HA_USER="${HA_USER:-avc}"
HA_KEY="${HA_KEY:-$HOME/.ssh/id_ed25519_openclaw_ha}"
HA_TARGET_FILE="${HA_TARGET_FILE:-/config/www/seagull-badges-card.js}"

if [[ ! -f "$SRC_FILE" ]]; then
  echo "[deploy-to-ha] source file not found: $SRC_FILE" >&2
  exit 1
fi

if [[ ! -f "$HA_KEY" ]]; then
  echo "[deploy-to-ha] ssh key not found: $HA_KEY" >&2
  exit 1
fi

echo "[deploy-to-ha] Deploying $SRC_FILE -> ${HA_USER}@${HA_HOST}:$HA_TARGET_FILE"

cat "$SRC_FILE" | ssh \
  -o BatchMode=yes \
  -o StrictHostKeyChecking=accept-new \
  -i "$HA_KEY" \
  "${HA_USER}@${HA_HOST}" \
  "sudo tee '$HA_TARGET_FILE' >/dev/null && sudo wc -c '$HA_TARGET_FILE'"

LOCAL_SHA="$(shasum -a 256 "$SRC_FILE" | awk '{print $1}')"
REMOTE_SHA="$(ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new -i "$HA_KEY" "${HA_USER}@${HA_HOST}" "sha256sum '$HA_TARGET_FILE' | awk '{print \$1}'")"

if [[ "$LOCAL_SHA" != "$REMOTE_SHA" ]]; then
  echo "[deploy-to-ha] checksum mismatch! local=$LOCAL_SHA remote=$REMOTE_SHA" >&2
  exit 1
fi

echo "[deploy-to-ha] OK sha256=$LOCAL_SHA"
