import pg from 'pg'
import 'dotenv/config'
import 'JSON'

import { dbLogger } from './logger.js'

const { Pool } = pg

async function errors (err) {
  switch (err.code) {
    case '57P01': // admin shutdown
      if (process.env.NODE_ENV !== 'test') {
        dbLogger.error('Database connection was closed by the server')
        await new Promise(resolve => setTimeout(resolve, 5000))
        process.exit(1)
      }
      break
    default:
      if (!(process.env.NODE_ENV === 'test' && err.message === 'Connection terminated unexpectedly')) {
        dbLogger.error('Unknown error occurred: ' + err.message)
        await new Promise(resolve => setTimeout(resolve, 5000))
        process.exit(1)
      }
  }
}

class Database {
  constructor () {
    this.Pool = new Pool({
      user: process.env.USER_LOGIN,
      password: process.env.USER_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: 'url_shortener'
    })

    this.Pool.on('connect', (_client) => {
      // On each new client initiated, need to register for error(this is a serious bug on pg, the client throw errors although it should not)
      _client.on('error', (err) => {
        errors(err)
      })
    })

    this.Pool.on('error', (err) => {
      errors(err)
    })
  }

  async connect () {
    try {
      await this.Pool.connect()
      dbLogger.info('Connected to the database')
    } catch (error) {
      dbLogger.error(`Error connecting to the database: ${error.message}`)
      throw error
    }
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
