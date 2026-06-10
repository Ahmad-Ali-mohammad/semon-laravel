## 2025-05-15 - Environment Tooling Caveats (tsc & ESLint)
**Learning:** In this sandbox, `npx tsc` may default to a deprecated `tsc@2.0.4` package rather than the project's TypeScript compiler. Similarly, the default ESLint version conflicts with legacy `.eslintrc.cjs` files.
**Action:** Always verify tool origin or use specific flags/environment variables (`ESLINT_USE_FLAT_CONFIG=false`) when running project checks to avoid false negatives or environment corruption.

## 2025-05-15 - Memoization Impact on Derived Lists
**Learning:** Sorting and slicing 1000 items on every render in a React component adds ~0.4ms-0.6ms of overhead. While seemingly small, it scales (N \log N)$ and can cause frame drops when combined with other components or frequent state updates.
**Action:** Proactively memoize all derived list operations (sort/filter/slice) in page-level components that consume global context data.
