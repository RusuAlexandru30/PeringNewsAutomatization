import express from "express"
import { connect } from "framer-api"

const app = express()
const PORT = parseInt(process.env.PORT || "3000", 10)

const FRAMER_API_KEY     = process.env.FRAMER_API_KEY
const FRAMER_PROJECT_URL = "https://framer.com/projects/Pering-News--nAdC4VR0rge9PUMrnDxd-16dWX"
const SECRET             = process.env.SECRET || "pering-secret-2026"

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({ status: "Framer Publisher running", port: PORT })
})

app.get("/health", (req, res) => {
  res.status(200).send("OK")
})

app.post("/publish", async (req, res) => {
  const auth = req.headers["authorization"]
  if (auth !== `Bearer ${SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  try {
    const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_KEY)
    const result = await framer.publish()
    await framer.deploy(result.deployment.id)
    await framer.disconnect()
    res.json({ success: true, deployment: result.deployment.id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${PORT}`)
})
