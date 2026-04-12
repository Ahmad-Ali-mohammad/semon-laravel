## 2025-05-15 - [Memoization of derived lists in HomePage]
**Learning:** Derived product lists (featured, bestsellers, new arrivals) involving O(N log N) operations like sort() should always be memoized in components that might re-render frequently.
**Action:** Use useMemo for any array transformation that depends on large datasets from context.
