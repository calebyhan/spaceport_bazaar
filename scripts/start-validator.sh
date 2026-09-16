#!/usr/bin/env sh
set -eu

case "$(uname -m)" in
  aarch64|arm64)
    validator="artifacts/bazaar-protobuf-starter-linux/spaceport-validate-linux-arm64"
    ;;
  x86_64|amd64)
    validator="artifacts/bazaar-protobuf-starter-linux/spaceport-validate-linux-x86_64"
    ;;
  *)
    echo "Unsupported Linux architecture: $(uname -m)" >&2
    exit 1
    ;;
esac

if [ ! -x "$validator" ]; then
  echo "Validator is missing or not executable: $validator" >&2
  exit 1
fi

exec "./$validator" --codec protobuf "$@"
