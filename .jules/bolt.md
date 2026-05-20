## 2025-05-15 - [React Performance Optimizations]
**Learning:** Memoizing derived data in the render body (sorting/filtering) and stabilizing navigation callbacks significantly reduces wasted render cycles. Conditional image loading (eager for LCP, lazy for others) improves Core Web Vitals.
**Action:** Always check for array operations in render and use React.memo on list items. Stabilize setPage-like callbacks in the root.

## 2025-05-15 - [Infrastructure Noise in PRs]
**Learning:** Renaming configuration files (like jest.config.js to .cjs) or creating new .gitignore files in a PR is considered 'noise' by reviewers and should be avoided unless strictly necessary for the build.
**Action:** Keep PRs focused only on the task at hand. Restore original infrastructure files before submission.
