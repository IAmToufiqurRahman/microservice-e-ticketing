import express from 'express'

import { currentUser } from '../middlewares/current-user'
import { requireAuth } from '../middlewares/require-auth'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  // currentUser is the actual json payload
  res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }

// goal of current-user route handler -->> our React application is going to need to figure out whether or not the user is signed in into our application, but the React application cannot directly look at the cookie and try to inspect and decide whether or not there is a valid JSON web token inside there. So the React application needs to be able to make a request to something inside of our app to figure out whether or not the user is currently logged in. That is the goal of this current-user route handler.
