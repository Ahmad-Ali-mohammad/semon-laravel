## 2026-05-30 - [Memoization of Derived Lists]
**Learning:** In-component sorting and filtering on datasets (like products/articles) on every render adds measurable overhead (~0.5ms for 1000 items), which accumulates.
**Action:** Use useMemo for all derived collections on landing pages to stabilize child props and reduce CPU cycles.
