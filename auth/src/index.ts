import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()

// traffic is being proxied to our app through ingress-nginx, this line make express aware of that
app.set('trust proxy', true)

app.use(json())
app.use(
  cookieSession({
    // disabling encryption in cookie because jwt is already encrypted
    signed: false,
    secure: true
  })
)

app.use(currentUserRouter)
app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)

app.get('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')

    console.log('Connected to Mongodb')
  } catch (error) {
    console.log(error)
  }

  app.listen(3000, () => {
    console.log('Listening to the port 3000!')
  })
}

start()
