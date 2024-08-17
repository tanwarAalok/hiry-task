require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = {
    dialect: "postgresql",
    schema: './src/db/schema.js',
    out: './src/db/migrations',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
};