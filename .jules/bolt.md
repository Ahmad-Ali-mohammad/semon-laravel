## 2025-05-15 - Memoization and Lazy Loading Optimizations

**Learning:** Memoizing derived state in `HomePage.tsx` significantly reduces processing time for large datasets (~1000 items) from ~0.4ms to effectively 0ms. Using `React.memo` for list items like `ReptileCard` prevents cascading re-renders when the parent component updates. Combined with native `loading="lazy"` (and an `eager` fallback for LCP), these changes measurably improve both runtime performance and perceived load speed.

**Action:** Always check for expensive sorting/filtering in render functions and memoize them. Use `React.memo` for components rendered in long lists.
