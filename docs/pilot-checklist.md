# HexaPay Pilot Checklist

## Backend `.env` values

Create or update `C:\Users\User\Documents\Hexapay\.env` on the backend machine with:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/hexapay
JWT_SECRET=replace-this-with-a-long-random-secret
API_PREFIX=/api/v1
APP_NAME=HexaPay API
CORS_ORIGIN=*
JWT_ISSUER=hexapay-api
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

If you need a clean template first, copy:

`C:\Users\User\Documents\Hexapay\.env.example`

to:

`C:\Users\User\Documents\Hexapay\.env`

## Recommended setup commands

Single-computer setup where the Electron app and backend run on the same machine:

```powershell
npm run setup:local
```

Office/LAN setup where clients should point to a shared backend machine:

```powershell
npm run setup:lan -- --host=192.168.1.50
```

Both commands now:

- update `hexapay.desktop.env`
- keep packaged desktop env copies in sync when they exist
- ensure PAYE and statutory deduction settings exist for every company
- archive legacy flat PAYE rules

## Frontend LAN target

Change `HEXAPAY_API_BASE_URL` in `C:\Users\User\Documents\Hexapay\hexapay.desktop.env`.

Example for a LAN backend machine:

```env
HEXAPAY_API_BASE_URL=http://192.168.1.50:4000/api/v1
```

The packaged desktop build also reads the same file next to `HexaPay.exe`:

`dist\HexaPay-win-unpacked\hexapay.desktop.env`

The easiest way to update this now is:

```powershell
npm run setup:local
```

or:

```powershell
npm run setup:lan -- --host=192.168.1.50
```

For a full office rollout using one shared backend machine and multiple client desktops, see:

`C:\Users\User\Documents\Hexapay\docs\office-lan-shared-install.md`

## Commands

Repeatable local verification:

```powershell
npm test
```

That command now runs:

- JavaScript syntax checks for the Electron app, backend, and project scripts
- all `shared/*.test.js` regression checks in a deterministic single-process sequence

Syntax checks only:

```powershell
npm run check:syntax
```

Shared regression tests only:

```powershell
npm run check:shared
```

Development backend:

```powershell
npm run dev
```

Development desktop app:

```powershell
npm run desktop
```

Pilot smoke checks:

```powershell
npm run smoke:pilot
```

The smoke script creates a temporary company, runs auth/employee/attendance/payroll checks, and then cleans that test data up automatically.

Encrypted cloud backup:

```powershell
npm run backup:cloud
```

Inspect an encrypted backup file:

```powershell
npm run backup:inspect -- "C:\path\to\backup-file.json.gz.enc"
```

Windows installer + portable package:

```powershell
npm run package:desktop
```

Full release prep:

```powershell
npm run release:prep
```

That command runs the release path in this order:

1. syntax checks
2. shared regression tests
3. Windows package build
4. pilot smoke validation

Legacy unpacked folder build:

```powershell
npm run package:desktop:unpacked
```

Installer output:

`C:\Users\User\Documents\Hexapay\dist\electron-builder`

Legacy unpacked output:

`C:\Users\User\Documents\Hexapay\dist\HexaPay-win-unpacked`

## Packaging notes

- `npm run package:desktop` now creates a proper Windows installer and a portable `.exe` with the HexaPay emblem embedded as the app icon.
- `npm run release:prep` is the recommended pre-release command because it proves checks, smoke coverage, and packaging in one pass.
- `npm run package:desktop:unpacked` remains available if you want the raw unpacked folder for manual copying.
- Update `hexapay.desktop.env` in the installed app folder, portable app folder, or unpacked folder so every client desktop points to the same shared backend machine.
- The desktop app now opens with a startup splash screen and does not load the main workspace until the backend `/health` check succeeds.

## Remaining blockers before a 2-3 computer pilot

- Give the backend machine a stable LAN IP or hostname.
- Make sure Windows Firewall allows inbound TCP `4000` on the backend machine.
- Set a real `JWT_SECRET` before inviting other testers.
- Run `npm run release:prep` on the backend machine and confirm it passes.
- Do one manual end-to-end pass for login, company switching, employee add/edit, attendance, leave, payroll generation, and export before handing it to testers.
- Configure encrypted off-site backups if you want pilot data protected beyond the backend machine.
