import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { validateRequest } from '../middlewares/validate-request'
import { BadRequestError } from '../errors/bad-request-error'
import { Password } from '../services/password'

const router = express.Router()

router.post(
  '/api/users/signin',

  // validation check by express-validator
  [body('email').isEmail().withMessage('Email must be Valid'), body('password').trim().notEmpty().withMessage('Password must be valid')],

  validateRequest, // validate request middleware

  async (req: Request, res: Response) => {
    const { email, password } = req.body

    // query to find users
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials')
    }

    // Password.compare() returns boolean
    const passwordsMatch = await Password.compare(existingUser.password, password)

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },

      process.env.JWT_KEY!
    )

    // Store it on session object
    req.session = {
      jwt: userJwt
    }

    res.status(200).send(existingUser)
  }
)

export { router as signinRouter }

// The signin flow:

// validation on incoming request: body method in express-validator works as a middleware to validate incoming data on the body of the signin post request

// validation check by build middeleware

// check errors, if found throw RequestValidationError
