require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.USR,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PSWD,
    port: 5432,
});

client.connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

module.exports = client;