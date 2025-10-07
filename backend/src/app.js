const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')

/* Routes */
const authRoutes = require('../src/routes/auth.routes')
const chatRoutes = require('../src/routes/chat.routes')

const app = express()

/* Middlewares */
try {
    app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true
    }))
} catch (err) {
    console.error('Error registering CORS middleware:', err)
    throw err
}

app.use(express.json())
app.use(cookieParser())

/* using Routes */
try {
    app.use('/api/auth' , authRoutes)
    console.log('Registered /api/auth')
} catch (err) {
    console.error('Error registering /api/auth route:', err)
    throw err
}

try {
    app.use('/api/chat' , chatRoutes)
    console.log('Registered /api/chat')
} catch (err) {
    console.error('Error registering /api/chat route:', err)
    throw err
}

// Serve frontend build (if present)
const path = require('path')
const clientBuildPath = path.join(__dirname, '../../frontend/dist')

try {
    app.use(express.static(clientBuildPath))
    console.log('Registered static client build at', clientBuildPath)
} catch (err) {
    console.error('Error registering static client build:', err)
    throw err
}

// For client-side routing, serve index.html for unknown GET routes without registering
// a path string (avoids path-to-regexp parsing issues for patterns like '*').
try {
    app.use((req, res, next) => {
        // only handle GET requests that are not API calls and accept HTML
        if (req.method === 'GET' && !req.path.startsWith('/api') && req.accepts('html')) {
            return res.sendFile(path.join(clientBuildPath, 'index.html'))
        }
        next()
    })
    console.log('Registered middleware to serve index.html for non-API GET requests')
} catch (err) {
    console.error('Error registering client-side routing middleware:', err)
    throw err
}

module.exports = app;