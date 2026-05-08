HexaPay installed app update

Use [C:/Users/User/Documents/Hexapay/scripts/build-update-package.ps1](C:/Users/User/Documents/Hexapay/scripts/build-update-package.ps1) to create a patch-style update for an already installed HexaPay app.

What it builds:
- `HexaPay-<version>-Update.exe`
- `HexaPay-<version>-Update.zip`

How it works:
- takes the current packaged `app.asar`
- creates a backup-aware update script
- wraps it into a self-running Windows update executable
- also creates a zip copy of the same payload

The update replaces only the installed runtime file:
- `resources\app.asar`

It does not reinstall HexaPay, move user data, or overwrite the installed env file.
