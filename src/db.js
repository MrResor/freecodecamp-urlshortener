import pg from 'pg'
import 'dotenv/config'
import 'JSON'

import { dbLogger } from './logger.js'

const { Pool } = pg

var test

class Database {
  constructor () {
    this.Pool = new Pool({
      user: process.env.USER_LOGIN,
      password: process.env.USER_PASSWORD,
      host: 'db',
      port: 5432,
      database: 'url_shortener'
    })
  }

  async connect () {
    await this.Pool.connect()
    dbLogger.info('Connected to the database')
  }

  async get_url (url = null, id = null) {
    // quick fix and problematic solution, but with carefull usage should be ok
    const query = `SELECT ID, URL FROM urls WHERE ${url ? 'URL' : 'ID'}=$1`
    const value = url || id
    const result = await this.Pool.query(query, [value])
    dbLogger.info(`SELECT ID, URL FROM urls WHERE ${url ? 'URL' : 'ID'}=${value}`)
    dbLogger.info(`Result: ${JSON.stringify(result.rows[0])}`)
    return result.rows[0]
  }

  async add_url (url) {
    const result = await this.Pool.query('INSERT INTO urls (URL) VALUES ($1) RETURNING ID', [url])
    dbLogger.info(`INSERT INTO urls (URL) VALUES (${url}) RETURNING ID`)
    dbLogger.info(`Result: ${JSON.stringify(result.rows[0])}`)
    return result.rows[0]
  }
}

const db = new Database()

await db.connect()

export { db }
