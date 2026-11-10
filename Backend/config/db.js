const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "snippets",
    password: "YOUR_PASSWORD",
    port: 5432
});

module.exports = pool;