const app = require("./app")
const env = require("./config/env")
const { connectDb } = require("./config/db")

async function startServer(){
  try{
    await connectDb()

    app.listen(env.port, () => {
      console.log(`${env.appName} listening on port ${env.port}`)
    })
  } catch (error){
    console.error("Failed to start HexaPay backend runtime.", error)
    process.exit(1)
  }
}

startServer()
