import express from 'express'

const mainView = express.Router()

mainView.get('/', (_, res) => {
  res.status(200).sendFile('./views/index.html', { root: '.' })
})

export { mainView }
