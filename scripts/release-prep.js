const path = require("node:path")
const { spawnSync } = require("node:child_process")

const projectRoot = path.resolve(__dirname, "..")
const nodeBinary = process.execPath
const electronBuilderCliPath = path.join(projectRoot, "node_modules", "electron-builder", "cli.js")

function runStep(label, command, args){
  console.log(`\n[HexaPay Release] ${label}`)
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false
  })

  if(result.error){
    console.error(`[HexaPay Release] ${label} failed before completion.`)
    console.error(result.error)
    process.exit(1)
  }

  if(result.status !== 0){
    process.exit(result.status || 1)
  }
}

function main(){
  runStep("Syntax checks and shared tests", nodeBinary, [path.join(projectRoot, "scripts", "run-checks.js")])
  runStep("Desktop signing readiness", nodeBinary, [path.join(projectRoot, "scripts", "release-signing-check.js")])
  runStep("Windows icon build", nodeBinary, [path.join(projectRoot, "scripts", "build-windows-icon.js")])
  runStep("Windows package build", nodeBinary, [electronBuilderCliPath, "--win", "nsis", "portable"])
  runStep("Pilot smoke validation", nodeBinary, [path.join(projectRoot, "scripts", "pilot-smoke.js")])
  console.log("\n[HexaPay Release] Release preparation completed successfully.")
}

main()
