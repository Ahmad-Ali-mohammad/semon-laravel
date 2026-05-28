# Bolt's Journal

## 2025-05-15 - Redundant List Processing in HomePage
**Learning:** The HomePage was performing array sorting, spreading, and slicing (O(n log n)) for multiple product lists (featured, bestsellers, newArrivals) on every render. With 1000+ products, this adds ~0.5ms per render which accumulates during frequent state updates (e.g., auth or context changes).
**Action:** Use `useMemo` to cache derived lists based on the `products` and `articles` dependencies from the database context.
