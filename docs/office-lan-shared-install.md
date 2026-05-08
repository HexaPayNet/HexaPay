# HexaPay Office LAN Shared Install

This setup is for an office where one Windows machine hosts the HexaPay backend and MongoDB, and multiple client desktops run only the HexaPay desktop app over the local network.

## Recommended layout

- Backend machine:
  - Runs MongoDB
  - Runs the HexaPay backend on port `4000`
  - Stores the main company data
  - Optionally runs scheduled backups
- Client desktops:
  - Run only the HexaPay desktop app
  - Connect to the backend machine over the office LAN

## 1. Prepare the backend machine

Install or confirm:

- Node.js
- MongoDB
- The HexaPay backend project

Create or update `C:\Users\User\Documents\Hexapay\.env` on the backend machine:

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

If you want a clean starting point, copy:

`C:\Users\User\Documents\Hexapay\.env.example`

to:

`C:\Users\User\Documents\Hexapay\.env`

Start the backend:

```powershell
npm run dev
```

Verify health on the backend machine:

```powershell
node -e "fetch('http://127.0.0.1:4000/health').then(async (r)=>{console.log(r.status); console.log(await r.text());}).catch((e)=>{console.error(e.message); process.exit(1);})"
```

Expected result:

- HTTP `200`
- JSON response with `"status":"ok"`

## 2. Give the backend machine a stable LAN address

Use one of these:

- A reserved DHCP IP such as `192.168.1.50`
- A stable hostname such as `hexapay-office`

Every client desktop must use the same backend address in `hexapay.desktop.env`.

After choosing the address, update the desktop runtime config and initialize statutory tax settings:

```powershell
npm run setup:lan -- --host=192.168.1.50
```

This command now:

- writes the LAN backend address into `hexapay.desktop.env`
- updates packaged desktop env copies when they exist
- ensures PAYE and statutory deduction settings exist for every company
- archives legacy flat PAYE rules

## 3. Open Windows Firewall on the backend machine

Allow inbound TCP port `4000` on the backend machine.

If the firewall blocks this port, the HexaPay splash screen on client desktops will stay on:

- `Backend unavailable`

## 4. Test the backend from another LAN machine

From a client desktop on the same office network, test the backend directly:

```powershell
node -e "fetch('http://192.168.1.50:4000/health').then(async (r)=>{console.log(r.status); console.log(await r.text());}).catch((e)=>{console.error(e.message); process.exit(1);})"
```

Replace `192.168.1.50` with the real backend machine IP or hostname.

Do not continue with client installation until this works.

## 5. Build the desktop app

Create the Windows installer and portable package:

```powershell
npm run package:desktop
```

Outputs:

- `C:\Users\User\Documents\Hexapay\dist\electron-builder\HexaPay-1.0.0-Setup.exe`
- `C:\Users\User\Documents\Hexapay\dist\electron-builder\HexaPay-1.0.0-Portable.exe`

Optional unpacked build:

```powershell
npm run package:desktop:unpacked
```

## 6. Configure each client desktop

On every client desktop, update the desktop runtime file so it points to the shared backend machine.

Use this format:

```env
HEXAPAY_API_BASE_URL=http://192.168.1.50:4000/api/v1
```

If you are preparing the packaged app on the backend machine before copying it to users, you can reuse:

```powershell
npm run setup:lan -- --host=192.168.1.50
```

You can place this next to the installed app executable or update the packaged copy depending on the deployment type.

Typical locations:

- Installed setup:
  - Next to the installed `HexaPay.exe`
- Portable build:
  - Next to `HexaPay-1.0.0-Portable.exe`
- Unpacked build:
  - `dist\HexaPay-win-unpacked\hexapay.desktop.env`

## 7. What users should see on startup

When the client app opens:

1. The HexaPay splash screen appears first.
2. It checks server connection.
3. It validates backend health through `/health`.
4. It opens the main app only after the backend responds healthy.

If the backend machine is offline or unreachable, the splash screen stays open and shows:

- a failure message
- a `Retry` button
- an `Exit` button

This is expected behavior.

## 8. Office rollout checklist

Complete these before handing HexaPay to office users:

- Backend machine has a stable LAN IP or hostname
- Backend `/health` works from another machine on the LAN
- Windows Firewall allows inbound TCP `4000`
- `JWT_SECRET` is set to a real secret
- Desktop clients all use the same backend address in `hexapay.desktop.env`
- `npm run smoke:pilot` passes on the backend machine
- One manual login and payroll flow succeeds from a client machine

## 9. Troubleshooting

### Splash shows `Backend unavailable`

Check:

- backend server is running
- backend machine IP or hostname is correct
- firewall allows TCP `4000`
- client machine can reach `http://BACKEND-IP:4000/health`
- `hexapay.desktop.env` points to the shared backend

### Splash shows `Startup bridge unavailable`

This indicates a desktop runtime issue, not a backend networking issue. Rebuild the desktop package and redeploy the updated installer or portable build.

### Backend works locally but not from clients

This is almost always one of:

- wrong LAN IP
- hostname not resolving
- firewall blocking port `4000`
- backend bound to the wrong machine or network profile

## 10. Recommended office operation

- Run the backend continuously on one office machine
- Do not run separate databases on each client desktop
- Back up the backend machine regularly
- Treat client desktops as app terminals that connect to the shared office backend
