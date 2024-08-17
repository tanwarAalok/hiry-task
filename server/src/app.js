const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');
const messagesRoutes = require('./routes/messages');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', messagesRoutes);

app.use(errorHandler);

module.exports = app;