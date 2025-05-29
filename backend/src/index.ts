import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5674

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Backend is live')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
