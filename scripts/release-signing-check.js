function hasValue(value){
  return typeof value === "string" && value.trim().length > 0
}

function collectSigningState(){
  const signingLink = process.env.WIN_CSC_LINK || process.env.CSC_LINK || ""
  const signingPassword = process.env.WIN_CSC_KEY_PASSWORD || process.env.CSC_KEY_PASSWORD || ""
  const signingThumbprint = process.env.WIN_CSC_SHA1 || ""
  const timestampServer = process.env.SIGNTOOL_TIMESTAMP_SERVER || process.env.CSC_TIME_STAMP_SERVER || ""
  const requireSigning = ["1", "true", "yes", "on"].includes(String(process.env.REQUIRE_DESKTOP_SIGNING || "").trim().toLowerCase())
  const canSign = hasValue(signingLink) && (hasValue(signingPassword) || hasValue(signingThumbprint))

  return {
    requireSigning,
    canSign,
    hasSigningLink: hasValue(signingLink),
    hasSigningPassword: hasValue(signingPassword),
    hasSigningThumbprint: hasValue(signingThumbprint),
    hasTimestampServer: hasValue(timestampServer)
  }
}

function main(){
  const signingState = collectSigningState()
  const summary = {
    ok: signingState.requireSigning ? signingState.canSign : true,
    checked_at: new Date().toISOString(),
    policy: signingState.requireSigning
      ? "required"
      : "optional",
    signing: signingState
  }

  if(signingState.requireSigning && !signingState.canSign){
    process.stderr.write(JSON.stringify({
      ...summary,
      error: "Desktop signing is required, but signing credentials are incomplete. Set WIN_CSC_LINK/CSC_LINK and WIN_CSC_KEY_PASSWORD/CSC_KEY_PASSWORD, or provide WIN_CSC_SHA1."
    }, null, 2) + "\n")
    process.exit(1)
  }

  process.stdout.write(JSON.stringify(summary, null, 2) + "\n")
}

main()
