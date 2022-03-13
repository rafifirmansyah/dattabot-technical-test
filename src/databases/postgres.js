import env from 'dotenv';
import pgPromiseLib from 'pg-promise';

env.config();

const pgp = pgPromiseLib({});

const postgres = pgp(`postgres://${process.env.POSTGRES_USER}:${encodeURIComponent(process.env.POSTGRES_PASSWORD)}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`);

export default postgres;