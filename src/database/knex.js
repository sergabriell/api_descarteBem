const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: 'descartebem'
    }
});

module.exports = knex;