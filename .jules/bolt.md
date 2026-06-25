## 2025-05-15 - Redundant Spread in Memoization
**Learning:** Using the spread operator before slicing an array (e.g., `[...arr].slice()`) is redundant for memoization as `.slice()` already returns a new array. While common, it adds a small, unnecessary overhead of a shallow copy.
**Action:** Always use direct slicing (`arr.slice()`) when creating derived lists in `useMemo` to maintain efficiency and readability.

## 2025-05-15 - Avoid Temporary Test Infrastructure in PRs
**Learning:** Including temporary configuration files like `jest.config.cjs` to bypass environment-specific test issues can be seen as repository "noise" and may lead to PR rejection if the files are incomplete or broken.
**Action:** Use temporary files for local verification but ensure they are deleted before requesting code review or submitting the PR.
