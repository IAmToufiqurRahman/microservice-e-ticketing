import express from 'express'

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
  res.send('Hi there! I am Ankan!')
})

export { router as signoutRouter }
