---
title: "Write Bash scripts that fail clearly"
description: "Validate inputs, quote paths, and leave the next person an error message they can act on."
date: 2026-11-08
lang: en
kind: tutorial
tags: ["Scripting", "Automation"]
starter: true
---

A script is an interface. Its inputs, output, and failure modes deserve the same care as a function in a larger program.

This example prints the number of lines in a file. It requires Bash and a Unix-like environment.

## Validate before doing work

```bash
#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  printf 'Usage: %s <input-file>\n' "$0" >&2
  exit 2
fi

input=$1

if [[ ! -f "$input" || ! -r "$input" ]]; then
  printf 'Error: expected a readable file: %s\n' "$input" >&2
  exit 1
fi

wc -l < "$input"
```

The caller gets a usage message for the wrong number of arguments and a concrete error for an unreadable file. Error messages go to standard error, leaving standard output available for the result.

## Quote paths every time

`"$input"` preserves a path containing spaces as one argument. Without quotes, shell word splitting and wildcard expansion can change its meaning.

Input redirection also avoids treating a filename beginning with a hyphen as an option to `wc`.

## Understand strict mode's limits

`set -euo pipefail` is useful, but it is not an error-handling strategy on its own:

- `-u` catches many accidental uses of unset variables.
- `pipefail` makes a pipeline fail when one of its commands fails.
- `-e` has context-dependent exceptions, including commands tested by `if`.

For an expected failure, handle it explicitly and explain what happened. Do not blanket-wrap a script in a handler that turns all failures into success.

## Test the awkward inputs

Try a missing argument, a missing file, an empty file, and a filename with spaces. Verify both the output and the exit status.

Remember that `wc -l` counts newline characters, not conceptual lines. A final unterminated line does not add to that count. Document that distinction if it matters to your users.
