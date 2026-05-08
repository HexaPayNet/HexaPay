const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const envSource = fs.readFileSync(path.join(__dirname, "..", "backend", "config", "env.js"), "utf8")
const appSource = fs.readFileSync(path.join(__dirname, "..", "backend", "app.js"), "utf8")
const releasePrepSource = fs.readFileSync(path.join(__dirname, "..", "scripts", "release-prep.js"), "utf8")
const signingDocSource = fs.readFileSync(path.join(__dirname, "..", "docs", "desktop-release-signing.md"), "utf8")
const productionEnvExample = fs.readFileSync(path.join(__dirname, "..", ".env.production.example"), "utf8")
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"))

test("production env config enforces strong secrets and explicit CORS", () => {
  assert.match(envSource, /if\(configuration\.isProduction\)\{/)
  assert.match(envSource, /JWT_SECRET must be set to a strong non-placeholder value in production/)
  assert.match(envSource, /CORS_ORIGINS must include at least one explicit origin in production/)
  assert.match(envSource, /CORS_ORIGINS cannot contain '\*' in production/)
  assert.match(envSource, /MONGO_URI must be set explicitly in production/)
})

test("backend app consumes normalized env settings for cors and request limits", () => {
  assert.match(appSource, /const allowedCorsOrigins = new Set\(env\.corsOrigins\)/)
  assert.match(appSource, /if\(env\.trustProxy\)\{/)
  assert.match(appSource, /express\.json\(\{ limit: env\.requestBodyLimit \}\)/)
  assert.match(appSource, /return env\.allowNullOrigin && \(!origin \|\| origin === "null"\)/)
})

test("release prep includes signing readiness and signing policy is documented", () => {
  assert.equal(packageJson.scripts["release:signing:check"], "node scripts/release-signing-check.js")
  assert.match(releasePrepSource, /Desktop signing readiness/)
  assert.match(signingDocSource, /REQUIRE_DESKTOP_SIGNING=true/)
  assert.match(signingDocSource, /WIN_CSC_LINK/)
  assert.match(productionEnvExample, /REQUIRE_DESKTOP_SIGNING=true/)
})
