const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "codeSnippetHub",
    password: "@rchit980",
    port: 5432
});

module.exports = pool;