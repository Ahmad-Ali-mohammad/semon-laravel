## 2026-07-01 - Strategic Lazy Loading for LCP
**Learning:** Adding `loading="lazy"` to all images can sometimes hurt Largest Contentful Paint (LCP) if the first images are also lazy-loaded.
**Action:** Use an index-based heuristic (e.g., `index > 2`) in list components to load the first few items eagerly while deferring the rest.
