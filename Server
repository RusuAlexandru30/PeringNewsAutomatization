// Framer Auto-Publisher — Express server
// Deploy pe Railway/Render, apelat de Make via HTTP POST

import express from "express"
import { connect } from "framer-api"

const app  = express()
const PORT = process.env.PORT || 3000

const FRAMER_API_KEY     = process.env.FRAMER_API_KEY
const FRAMER_PROJECT_URL = "https://framer.com/projects/Pering-News--nAdC4VR0rge9PUMrnDxd-16dWX"
const SECRET             = process.env.SECRET || "pering-secret-2026"

app.use(express.json())

app.get("/", (req, res) => {
  res.json({ status: "Framer Publisher running" })
})

app.post("/publish", async (req, res) => {
  // Verificare simpla de securitate
  const auth = req.headers["authorization"]
  if (auth !== `Bearer ${SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  console.log("Starting Framer publish...")

  try {
    const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_KEY)

    // Publica o versiune preview
    const result = await framer.publish()
    console.log("Published:", result)

    // Promoveaza la productie
    await framer.deploy(result.deployment.id)
    console.log("Deployed to production")

    await framer.disconnect()

    res.json({
      success: true,
      deployment: result.deployment.id,
      hostnames: result.hostnames,
    })

  } catch (err) {
    console.error("Publish error:", err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Framer Publisher listening on port ${PORT}`)
})
