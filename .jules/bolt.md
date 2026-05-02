## 2025-05-15 - Stabilizing Context and Derived Lists
**Learning:** In projects with a large, central DatabaseContext that is consumed by many components, unstable modifier functions cause frequent, widespread re-renders. Additionally, derived data lists on the HomePage (like sorted bestsellers) should be memoized to prevent O(N log N) overhead on every render when the source data hasn't changed.
**Action:** Always wrap context modifier functions in useCallback and memoize derived data lists that involve sorting or filtering of large datasets.
