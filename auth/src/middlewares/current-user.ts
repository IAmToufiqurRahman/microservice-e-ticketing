import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// precisely describes what payload is
interface UserPayLoad {
  id: string
  email: string
}

// make modification to a type definition, add an additional property to the type definition of what a request is
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayLoad
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next()
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayLoad

    // setting the payload on req.currentUser so that further middlewares or other route handlers down this chain can figure out automatically who the current user is
    req.currentUser = payload
  } catch (error) {
    console.log(error)
  }

  next()
}

// middleware to extract the JWT payload and set it on 'req.currentUser', it is going to attempt to find whether or not the user is logged in, if they're not the currentUser will be undefined, but if they have a JSON web token, we'll try to extract the payload and then set it on currentUser so it can be used by our other middlewares or the request handlers.

// The optional chaining operator (?.) enables you to read the value of a property located deep within a chain of connected objects without having to check that each reference in the chain is valid.

// jwt.verify() -->> this method is written in jwt library to extract information out of Json Web Token.
