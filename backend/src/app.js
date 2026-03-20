require('dotenv').config()
const express = require('express')
const cors = require('cors')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/products', require('./routes/product.routes'))
app.use('/api/orders', require('./routes/order.routes'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada` })
})

app.use(errorMiddleware)

module.exports = app