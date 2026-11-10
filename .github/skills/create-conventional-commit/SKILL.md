---
name: create-conventional-commit
description: 'Inspect project changes, write a detailed Conventional Commit message with an 80-character subject and 80-character body-line limit, then create the commit. Use when asked to create, make, or commit a conventional commit.'
argument-hint: '[optional change scope or intent]'
user-invocable: true
---

# Create a Conventional Commit

Inspect the intended changes, write a Conventional Commit message, and create
the commit without asking for approval when the change set is clear. Invoking
this skill authorizes creating the commit; it does not authorize pushing or
rewriting existing history.

## 1. Identify the change set

1. Confirm the repository root and inspect `git status --short --branch`.
2. If changes are already staged, treat the staged changes as the explicit
   boundary. Do not stage or include other changes.
3. If nothing is staged, inspect the unstaged and untracked changes. When they
   clearly belong to one task, select and stage only those related paths.
   Preserve unrelated modifications.
4. If the intended paths are unclear, changes belong to multiple tasks, or
   there are no changes, stop and explain what is needed. Ask which paths to
   include when the selection cannot be determined safely.
5. Inspect the complete content of every intended change, including new files.
   Check for accidentally included credentials, private keys, tokens, or other
   sensitive data. If a likely secret is present, do not stage or commit it;
   explain the concern without printing the secret.

## 2. Write the message

Use the Conventional Commits header:

```text
<type>[optional scope][!]: <imperative description>
```

Choose a truthful type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
`test`, `build`, `ci`, `chore`, or `revert`. Use a short, relevant scope when
helpful. Include `!` for a breaking change and describe the migration in a
`BREAKING CHANGE:` footer.

- Keep the subject at or below **80 characters**, including the type, scope,
  punctuation, and spaces.
- Keep each body and footer line at or below **80 characters**.
- Use a concise, imperative subject; omit the final period.
- Include a blank line after the subject.
- Add a detailed body that explains why the change was needed and what changed.
  Mention important behavior or decisions and the tests actually run. Use
  short paragraphs or bullets; do not merely restate the subject.
- Wrap lines to the limit rather than relying on terminal or editor wrapping.
  Count Unicode characters, not UTF-8 bytes.
- Keep standard trailers within the same line limit.

Unless the user explicitly asks not to, add this trailer as the final line:

```text
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

Before committing, check every message line against its applicable limit and
confirm the body accurately describes the inspected changes.

## 3. Validate and commit

1. Check that the staged paths contain only the intended changes.
2. Run `git diff --cached --check` and inspect the complete staged diff.
3. Commit the reviewed staged changes with the prepared message. Do not amend,
   force, reset, rebase, or push.
4. Confirm the commit succeeded with `git status --short --branch` and inspect
   the latest commit message. Report the hash, subject, and validation status.

Surface Git errors as errors. Do not silently skip a failed check or claim a
commit succeeded unless Git confirms it.
