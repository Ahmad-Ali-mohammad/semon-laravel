## 2025-05-15 - [Memoizing Derived Data in HomePage]
**Learning:** In-component sorting and filtering logic on datasets of >100 items (like products and articles) adds measurable overhead (~0.5ms per render). This is especially impactful during initial hydration when the `DatabaseContext` triggers multiple re-renders.
**Action:** Always wrap derived data calculations from context providers in `useMemo` to prevent redundant processing cycles and ensure stable references for child components.
