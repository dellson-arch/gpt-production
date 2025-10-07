require('dotenv').config()
const app = require('./src/app')
const connectDb = require('./src/db/db')
const initSocketServer = require('./src/sockets/socket.server')
const httpServer = require('http').createServer(app)

connectDb()
try {
    console.log('Calling initSocketServer...')
    initSocketServer(httpServer)
    console.log('initSocketServer completed')
} catch (err) {
    console.error('Error during initSocketServer:', err)
    process.exit(1)
}

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});