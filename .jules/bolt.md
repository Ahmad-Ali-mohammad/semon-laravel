## 2025-05-15 - HomePage Performance Optimization
**Learning:** Derived data calculations (sorting/filtering) in HomePage.tsx on a dataset of 1000 items takes ~0.4ms per render. While small, this adds up in a complex React tree and can be easily optimized with useMemo.
**Action:** Use useMemo for any data processing that involves sorting or filtering arrays of >100 items.
