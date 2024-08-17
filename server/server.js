require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const setupSocket = require('./src/config/socket');

const server = http.createServer(app);
const { io, userSockets } = setupSocket(server);

app.set('io', io);
app.set('userSockets', userSockets);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});