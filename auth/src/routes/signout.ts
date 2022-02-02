import express from 'express'

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
  req.session = null

  res.send({})
})

export { router as signoutRouter }

// sign out a user means, we're going to send back a header that's going to tell the user's browser to dump all the information inside that cookie using the cookie-session library and that's going to remove the JSON web token.
