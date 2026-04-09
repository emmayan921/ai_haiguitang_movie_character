import './loadEnv'
import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFound'
import { requestLogger } from './middleware/requestLogger'
import { aiRouter } from './routes/ai'

const app = express()
const PORT = Number(process.env.PORT || 8787)

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/ai', aiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`)
})
