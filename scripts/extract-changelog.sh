#!/bin/bash

# MIT License
#
# Copyright (c) 2026 Xiao Hanyu (https://xiaohanyu.me)
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# Extract the CHANGELOG.md section for a given version as release notes.
# Usage: ./extract-changelog.sh <version> [output_file]
# Example: ./extract-changelog.sh 0.1.0 release_notes.md

set -e

VERSION="${1#v}"
OUTPUT_FILE="${2:-/dev/stdout}"

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version> [output_file]" >&2
  exit 1
fi

if [ ! -f CHANGELOG.md ]; then
  echo "CHANGELOG.md not found; skipping changelog extraction" >&2
  exit 0
fi

# Sections from commit-and-tag-version look like "## [0.1.0](url) (date)";
# print from the matching header until the next version header.
NOTES="$(awk -v ver="$VERSION" '
  $0 ~ "^## \\[?" ver "[\\]]" { found = 1; next }
  found && /^## / { exit }
  found && NF { started = 1 }
  started { print }
' CHANGELOG.md)"

if [ -z "$(printf '%s' "$NOTES" | tr -d '[:space:]')" ]; then
  echo "No changelog section found for $VERSION" >&2
  NOTES="See the commit history for changes."
fi

printf '%s\n' "$NOTES" >"$OUTPUT_FILE"
