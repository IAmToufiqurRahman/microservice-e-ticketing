import express from 'express'

const router = express.Router()

router.post('/api/users/signin', (req, res) => {
  res.send('Hi there! I am Ankan!')
})

export { router as signinRouter }
