## 2025-05-14 - Memoize HomePage Derived Lists
**Learning:** Derived lists (sorting/filtering) in React components can be expensive as the dataset grows. In this app, sorting 1000 items took ~0.4ms per render.
**Action:** Always use useMemo for expensive data transformations in render to stabilize props and reduce computation.
