const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '211265',
        database: 'descartebem'
    }
});

module.exports = knex;