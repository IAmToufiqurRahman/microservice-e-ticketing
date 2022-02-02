import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middlewares/validate-request'

const router = express.Router()

router.post(
  '/api/users/signup',

  [body('email').isEmail().withMessage('Email Must be Valid'), body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')],

  validateRequest, // validate request middleware

  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      console.log('Email in use')

      throw new BadRequestError('Email in use')
    }

    // save the new user
    const user = User.build({ email, password })
    await user.save()

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },

      // the ! mark tells typescript that this env variable is defined already
      process.env.JWT_KEY!
    )

    // Store it on session object
    req.session = {
      jwt: userJwt
    }

    res.status(201).send(user)
  }
)

export { router as signupRouter }
