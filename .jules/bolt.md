## 2026-04-15 - [Navigation Stabilization and Memoization]
**Learning:** Top-level callbacks in custom routing systems should be stabilized with `useCallback` to prevent cascading re-renders. Derived data on the Home page can be expensive to compute (sorting/filtering) and should be memoized.
**Action:** Always wrap global navigation handlers in `useCallback` and memoize derived product lists.
