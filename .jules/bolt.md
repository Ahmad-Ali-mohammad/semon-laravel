## 2025-05-15 - Environment Constraints for Verification
**Learning:** The sandbox environment lacks `node_modules` and standard CLI tools in the PATH. Attempting to install dependencies can trigger "diff size unusually large" warnings because `node_modules` is not always ignored by the environment's version control.
**Action:** Rely on manual benchmarking scripts and direct file inspections for verification when standard test suites fail due to environment configuration. Avoid large `npm install` commands unless strictly necessary.
