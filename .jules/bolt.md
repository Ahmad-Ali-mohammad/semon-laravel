## 2025-05-14 - Home Page Rendering Optimization
**Learning:** Derived list calculations (sorting and slicing) on datasets of 1000+ items can take ~0.6ms per render. While small, this compounds when combined with unnecessary child component re-renders. Stabilizing parent callbacks and memoizing children is essential for `React.memo` to be effective.
**Action:** Always pair `React.memo` on children with `useCallback` on passed functions from the parent to ensure stable references and prevent broken memoization chains.
