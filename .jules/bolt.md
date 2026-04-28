## 2025-05-15 - [Memoizing derived lists in HomePage]
**Learning:** In-component sorting and filtering on lists of ~1000 items (O(N log N)) adds significant overhead (~0.4ms) to every render cycle, even when data hasn't changed.
**Action:** Always use `useMemo` for derived collections that involve sorting or filtering, especially in high-traffic components like HomePage.
