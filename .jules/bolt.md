## 2025-05-15 - Dependency and Environment Management
**Learning:** Running `npm install` in this sandbox environment can unexpectedly modify `package-lock.json` or create a massive `node_modules` diff that triggers system warnings and impacts code review scores if not cleaned up.
**Action:** Always use `restore_file` for `package-lock.json` and `rm -rf node_modules` before final submission if temporary dependencies were needed for testing. Avoid committing `package-lock.json` changes unless explicitly tasked with dependency updates.
