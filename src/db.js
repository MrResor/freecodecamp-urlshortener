import pg from 'pg';
import 'dotenv/config';
import 'JSON';

import { db_logger } from './logger.js';

const { Pool } = pg;

class Database {

    constructor() {
        this.Pool = new Pool({
            user: process.env.USER_LOGIN,
            password: process.env.USER_PASSWORD,
            host: 'db',
            port: 5432,
            database: 'url_shortener',
        });
    }

    async connect() {
        await this.Pool.connect();
        db_logger.info('Connected to the database');
    }

    async get_url(url = null, id = null) {
        // quick fix and problematic solution, but with carefull usage should be ok
        let query = `SELECT ID, URL FROM urls WHERE ${url ? 'URL' : 'ID'}=$1`;
        let value = url ? url : id;
        let result = await this.Pool.query(query, [value]);
        db_logger.info(`SELECT ID, URL FROM urls WHERE ${url ? 'URL' : 'ID'}=${value}`);
        db_logger.info(`Result: ${JSON.stringify(result.rows[0])}`);
        return result.rows[0];
    }

    async add_url(url) {
        let result = await this.Pool.query('INSERT INTO urls (URL) VALUES ($1) RETURNING ID', [url]);
        db_logger.info(`INSERT INTO urls (URL) VALUES (${url}) RETURNING ID`);
        db_logger.info(`Result: ${JSON.stringify(result.rows[0])}`);
        return result.rows[0];
    }
}

const db = new Database();

await db.connect()

export { db };