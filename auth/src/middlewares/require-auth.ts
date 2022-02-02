import { Request, Response, NextFunction } from 'express'

import { NotAuthorizedError } from '../errors/not-authorized-error'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError()
  }

  next()
}

// we're going to assume that we'll never use the requireAuth middleware without previously running the currentUser middleware
