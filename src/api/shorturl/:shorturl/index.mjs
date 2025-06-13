import express from 'express'

import { db } from '../../../db.mjs'

const getUrl = express.Router()

getUrl.get('/api/shorturl/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return res.status(401).json({ error: 'Invalid ID' })
  }

  const result = await db.get_url(null, id)

  if (result) {
    res.status(302).redirect(result.url)
  } else {
    res.status(404).json({ error: 'No url found for the given ID' })
  }
})

export { getUrl }
