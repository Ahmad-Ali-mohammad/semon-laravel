## 2025-05-23 - Memoization of Derived Lists in HomePage
**Learning:** Derived data processing (sorting/slicing) on large datasets (>1000 items) in the render path adds measurable overhead (~2ms per render).
**Action:** Always wrap expensive list transformations in useMemo to stabilize references and improve render performance.
