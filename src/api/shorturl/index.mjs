import express from 'express'
import { db } from '../../db.mjs'

const addUrl = express.Router()

addUrl.post('/api/shorturl', async (req, res) => {
  let url
  try {
    url = new URL(req.body.url)
  } catch (e) {
    res.status(400).json({ error: 'invalid url' }) // status code should be 400 but does not pass freecodeacamp tests
    return
  }
  if (!['https:', 'http:'].includes(url.protocol)) {
    res.status(400).json({ error: 'invalid url' }) // same as above
    return
  }

  url = req.body.url
  let result = await db.get_url(url, null)
  result = result !== undefined ? result : await db.add_url(url)

  res.status(200).json({ original_url: `${url}`, short_url: result.id })
})

export { addUrl }
