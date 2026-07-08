## 2026-07-08 - [Formatting Noise]
**Learning:** Running `npx prettier --write` in this environment changed indentation from 4 spaces to 2 spaces across entire files, causing massive PR noise and review rejection.
**Action:** Always verify existing file indentation before applying automated formatting; use targeted edits instead of global formatters if they deviate from project defaults.
