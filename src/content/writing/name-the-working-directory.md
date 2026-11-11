---
title: "Make the working directory part of the contract"
description: "A relative path is only predictable when the starting point is predictable too."
date: 2026-11-06
lang: en
kind: note
tags: ["Scripting"]
starter: true
---

A script that runs from your terminal may fail in CI because the working directory is different.

Choose a contract:

- Require the caller to run from the project root and validate that assumption.
- Accept a project directory as an argument.
- Resolve paths relative to the script's location, if that fits how the script is distributed.

Whichever you choose, write it down in the usage message. Avoid changing directories implicitly and hoping every caller shares your assumptions.
