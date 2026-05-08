# HexaPay Desktop Release Signing

Last Updated: April 30, 2026

## Policy

HexaPay now follows this desktop release signing policy:

- internal and test builds may be unsigned
- production distribution builds should be signed
- if `REQUIRE_DESKTOP_SIGNING=true`, release preparation fails unless signing credentials are present

## Signing Inputs

Electron Builder will use the normal Windows code-signing environment variables.

Supported inputs:

- `WIN_CSC_LINK` or `CSC_LINK`
- `WIN_CSC_KEY_PASSWORD` or `CSC_KEY_PASSWORD`
- optional `WIN_CSC_SHA1`
- optional `SIGNTOOL_TIMESTAMP_SERVER` or `CSC_TIME_STAMP_SERVER`

## Readiness Check

Run:

```powershell
npm run release:signing:check
```

This reports whether the current environment can sign a Windows desktop build.

If you want signing to be mandatory for a release host, set:

```env
REQUIRE_DESKTOP_SIGNING=true
```

## Release Prep Behavior

`npm run release:prep` now includes the signing readiness check before packaging.

Behavior:

- if signing is optional and credentials are missing, packaging still proceeds
- if signing is required and credentials are missing, release prep fails fast

## Recommended Production Setup

- use a real OV or EV code-signing certificate
- keep the certificate or secret link only on the release machine
- set a timestamp server so signed builds remain valid after certificate expiry
- test one signed NSIS installer and one signed portable build before public distribution
