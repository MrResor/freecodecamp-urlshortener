import 'dotenv/config'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { setupContainer } from './container.mjs'

let app, container, port

beforeAll(async () => {
  [container, port] = await setupContainer(5432 + Number(process.env.VITEST_WORKER_ID))

  vi.stubEnv('DB_PORT', port.toString())

  // Import the app AFTER the container is up and env vars are set
  const mod = await import('../src/express.js')
  app = mod.app
}, 60_000)

afterAll(async () => {
  if (container) {
    await container.stop()
  }
  vi.unstubAllEnvs()
})

let url

describe('/api/shorturl', () => {
  it('add url', async () => {
    const res = await await request(app).post('/api/shorturl').send({ url: "https://www.google.com" })

    url = res.body.short_url // Store the short URL for later tests

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ 
      original_url: 'https://www.google.com',
      short_url: expect.any(Number)
    })
  })

  it('try adding invalid url', async () => {  
    const res = await request(app).post('/api/shorturl').send({ url: "invalid-url" })

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid URL' })
  })

})

describe('/api/shorturl/:id', () => {
  it('get url by id', async () => {
    const res = await request(app).get('/api/shorturl/1')

    expect(res.statusCode).toBe(301)
    expect(res.headers.location).toBe('https://www.google.com')
  })

  it('try getting non-existing url', async () => {
    const res = await request(app).get('/api/shorturl/9999')

    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual({ error: 'No url found for the given ID' })
  })

  it('try getting url with invalid id', async () => {
    const res = await request(app).get('/api/shorturl/invalid-id')

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid ID' })
  })
})
