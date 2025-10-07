const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')

/* Routes */
const authRoutes = require('../src/routes/auth.routes')
const chatRoutes = require('../src/routes/chat.routes')

const app = express()

/* Middlewares */
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

/* using Routes */
app.use('/api/auth' , authRoutes)
app.use('/api/chat' , chatRoutes)

module.exports = app;