## 2025-05-14 - Memoization of Derived Data in HomePage
**Learning:** In-component sorting and slicing of datasets (e.g., 1000 items) adds measurable overhead (~0.44ms per render) which can lead to frame drops if the component re-renders frequently.
**Action:** Always memoize derived lists that involve sorting, filtering, or slicing large arrays using `useMemo`.
