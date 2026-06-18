## 2025-05-15 - Node Modules Missing in Sandbox Environment
**Learning:** The sandbox environment may not have `node_modules` installed, leading to failures in starting the development server with `vite` even when using `npx`. Standard `npm install` might be required but should be avoided to prevent large diffs.
**Action:** Use manual code verification and localized `tsc` checks when the full dev environment is unavailable. Always clean up temporary log files like `dev_server.log` before submission.
