---
title: "Automate the check before the action"
description: "A practical pattern for making repetitive work observable before giving it the power to change things."
date: 2026-11-05
lang: en
kind: tutorial
tags: ["Automation", "Scripting"]
starter: true
---

Before automating an action, automate the inspection that tells you whether the action is needed.

For a first iteration, a report is often more useful than a script that immediately changes files.

## Make the input explicit

Suppose you want to find empty Markdown files in a documentation directory. With Python 3, start with a read-only report:

```python
from pathlib import Path
import argparse

parser = argparse.ArgumentParser(description="Report empty Markdown files.")
parser.add_argument("directory", type=Path)
args = parser.parse_args()

root = args.directory
if not root.is_dir():
    parser.error(f"not a directory: {root}")

for path in sorted(root.rglob("*.md")):
    if path.is_file() and path.stat().st_size == 0:
        print(path)
```

The directory is an argument rather than an implicit working-directory assumption. An invalid directory produces a nonzero exit status.

## Review the report

Run the script against a small directory first. Create one empty file and one nonempty file. Confirm that only the empty file is reported.

Do not silently skip permission errors. If the scan cannot inspect part of the tree, you need to know the report is incomplete.

## Decide what success means

There are at least two reasonable contracts:

| Purpose | Meaning of success |
| --- | --- |
| Inventory report | The scan completed, even if it found empty files |
| CI quality check | The scan completed and found no empty files |

This example uses the inventory contract. A CI version should explicitly return a nonzero status when it finds a violation.

## Add actions only after trust

If you later add a cleanup mode, keep reporting as the default. Make mutation an explicit opt-in, constrain the target directory, and test it using disposable fixtures.

Automation should remove repetitive decisions, not hide consequential ones.
