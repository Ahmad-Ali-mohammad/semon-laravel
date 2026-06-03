## 2025-06-03 - Memoize HomePage derived lists
**Learning:** In-component sorting and filtering logic on datasets (even small ones like products/articles) adds measurable overhead (~0.5ms per render) that scales with render frequency.
**Action:** Always wrap data derivation logic in `useMemo` when it involves sorting, filtering, or deep-cloning large arrays.
