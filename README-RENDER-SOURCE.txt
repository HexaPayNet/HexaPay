HexaPay Render source export

This folder contains only the source files that should go to GitHub/Render.

Excluded on purpose:
- .env
- node_modules
- dist
- logs
- tmp-appdata
- .codex

Before redeploying to Render:
1. Remove generated files from the public GitHub repo and replace them with the contents of this folder.
2. Rotate any exposed secrets:
   - Atlas DB password
   - JWT secret
   - backup/cloud keys previously stored in .env
3. Update Render environment variables with the rotated values.
4. Redeploy the service and test /health.
