require('dotenv').config({path: '../../../.env'});

const knexConfig = {
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    },
    migrations: {
        directory: '../migrations',
    },
    seeds: {
        directory: '../seeds',
    }
};

module.exports = knexConfig;
