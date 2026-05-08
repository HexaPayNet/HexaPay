const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const apiSource = fs.readFileSync(path.join(__dirname, "..", "js", "api.js"), "utf8")
const preloadSource = fs.readFileSync(path.join(__dirname, "..", "preload.js"), "utf8")
const mainSource = fs.readFileSync(path.join(__dirname, "..", "main.js"), "utf8")

test("desktop runtime exposes packaged mode to the renderer", () => {
  assert.match(mainSource, /isPackaged: app\.isPackaged/)
  assert.match(preloadSource, /isPackaged: Boolean\(parsedValue\.isPackaged\)/)
  assert.match(preloadSource, /isPackaged: desktopRuntimeConfig\.isPackaged/)
})

test("api surfaces backend connectivity failures with a clear runtime message", () => {
  assert.match(apiSource, /function createBackendConnectivityError\(error, options = \{\}\)/)
  assert.match(apiSource, /Unable to reach the HexaPay backend at \$\{backendLabel\} while trying to \$\{actionLabel\}\./)
  assert.match(apiSource, /Check that the backend is running, then try again\./)
  assert.match(apiSource, /backendConnectionError = true/)
})

test("mock fallback is disabled for packaged builds, live sessions, and risky operations", () => {
  assert.match(apiSource, /const MOCK_API_ENABLE_STORAGE_KEY = "hexapay-enable-mock-api"/)
  assert.match(apiSource, /function isMockApiExplicitlyEnabled\(\)/)
  assert.match(apiSource, /localStorage\.getItem\(MOCK_API_ENABLE_STORAGE_KEY\) === "true"/)
  assert.match(apiSource, /function canUseDevelopmentMockApi\(\)/)
  assert.match(apiSource, /if\(isDesktopRuntime\(\)\)\{\s*return isMockApiExplicitlyEnabled\(\)\s*\}/)
  assert.match(apiSource, /function createMockApiDisabledError\(\)/)
  assert.match(apiSource, /HexaPay mock mode is disabled\./)
  assert.match(apiSource, /if\(!canUseDevelopmentMockApi\(\)\)\{\s*return Promise\.reject\(createMockApiDisabledError\(\)\)\s*\}/)
  assert.match(apiSource, /function shouldFallbackToMock\(error, options = \{\}\)/)
  assert.match(apiSource, /if\(error\?\.backendResponse \|\| error\?\.backendConnectionError\)\{\s*return false\s*\}/)
  assert.match(apiSource, /if\(!canUseDevelopmentMockApi\(\)\)\{\s*return false\s*\}/)
  assert.match(apiSource, /return operation === "read"/)
  assert.match(apiSource, /shouldFallbackToMock\(error, \{ operation: "auth" \}\)/)
  assert.match(apiSource, /shouldFallbackToMock\(error, \{ operation: "write" \}\)/)
})
