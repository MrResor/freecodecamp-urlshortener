import 'dotenv/config'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { setupContainer } from './container.mjs'

let app, container, port

beforeAll(async () => {
  [container, port] = await setupContainer(5432 + Number(process.env.VITEST_WORKER_ID))

  vi.stubEnv('DB_PORT', port.toString())

  // Import the app AFTER the container is up and env vars are set
  const mod = await import('../src/express.mjs')
  app = mod.app
}, 60_000)

afterAll(async () => {
  if (container) { await container.stop() }
  vi.unstubAllEnvs()
})

const url = 'https://www.google.com'

describe('/api/shorturl', () => {
  it('add url', async () => {
    const res = await await request(app).post('/api/shorturl').send({ url })

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      original_url: 'https://www.google.com',
      short_url: expect.any(Number)
    })
  })

  it('try adding invalid url', async () => {
    const res = await request(app).post('/api/shorturl').send({ url: 'invalid-url' })

    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({ error: 'invalid url' })
  })
})
