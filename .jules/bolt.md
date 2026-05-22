## 2026-05-22 - Memoization in HomePage
**Learning:** In-component sorting and slicing of product lists (e.g., bestsellers, new arrivals) can add ~0.5ms of overhead per render. While small, this accumulates in complex layouts.
**Action:** Always memoize derived lists in main page components using useMemo to ensure stable references and avoid redundant computations.
