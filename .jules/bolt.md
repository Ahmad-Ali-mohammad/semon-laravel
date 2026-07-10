## 2026-07-10 - Memoization of Derived Data in HomePage
**Learning:** The `DatabaseContext` triggers frequent re-renders during initial data hydration and subsequent updates. Derived data calculations like `sort()` and `find()` on large arrays (1000+ items) in the render path add ~0.4ms of overhead per render.
**Action:** Always memoize derived lists (featured, bestsellers, etc.) using `useMemo` in components consuming `DatabaseContext` to ensure stable references and prevent redundant calculations.
