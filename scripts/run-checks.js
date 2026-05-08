const fs = require("node:fs")
const path = require("node:path")
const { spawnSync } = require("node:child_process")

const projectRoot = path.resolve(__dirname, "..")
const nodeBinary = process.execPath

const syntaxRoots = [
  path.join(projectRoot, "main.js"),
  path.join(projectRoot, "preload.js"),
  path.join(projectRoot, "splash.js"),
  path.join(projectRoot, "js"),
  path.join(projectRoot, "backend"),
  path.join(projectRoot, "scripts")
]

function collectJavaScriptFiles(entryPath, files = []){
  if(!fs.existsSync(entryPath)){
    return files
  }

  const stats = fs.statSync(entryPath)
  if(stats.isFile()){
    if(entryPath.endsWith(".js")){
      files.push(entryPath)
    }
    return files
  }

  for(const entry of fs.readdirSync(entryPath, { withFileTypes: true })){
    if(entry.name === "node_modules" || entry.name === "dist"){
      continue
    }

    collectJavaScriptFiles(path.join(entryPath, entry.name), files)
  }

  return files
}

function runStep(label, command, args){
  console.log(`\n[HexaPay Checks] ${label}`)
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false
  })

  if(result.status !== 0){
    process.exit(result.status || 1)
  }
}

function main(){
  const syntaxOnly = process.argv.includes("--syntax-only")
  const testsOnly = process.argv.includes("--tests-only")
  const syntaxFiles = [...new Set(syntaxRoots.flatMap((entryPath) => collectJavaScriptFiles(entryPath)))]
    .sort((left, right) => left.localeCompare(right))
  const sharedTestFiles = fs.readdirSync(path.join(projectRoot, "shared"))
    .filter((fileName) => fileName.endsWith(".test.js"))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => path.join(projectRoot, "shared", fileName))

  if(!testsOnly){
    console.log(`[HexaPay Checks] Syntax files: ${syntaxFiles.length}`)
    for(const filePath of syntaxFiles){
      runStep(`Syntax check ${path.relative(projectRoot, filePath)}`, nodeBinary, ["--check", filePath])
    }
  }

  if(!syntaxOnly){
    console.log(`\n[HexaPay Checks] Shared tests: ${sharedTestFiles.length}`)
    for(const filePath of sharedTestFiles){
      runStep(`Shared test ${path.basename(filePath)}`, nodeBinary, [filePath])
    }
  }

  if(syntaxOnly){
    console.log("\n[HexaPay Checks] All syntax checks passed.")
    return
  }

  if(testsOnly){
    console.log("\n[HexaPay Checks] All shared tests passed.")
    return
  }

  console.log("\n[HexaPay Checks] All syntax checks and shared tests passed.")
}

main()
