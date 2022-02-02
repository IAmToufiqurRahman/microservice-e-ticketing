import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { RequestValidationError } from '../errors/request-validation-error'

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array())
  }

  next()
}

// errors.array() --> errors is an object, errors.array() turns this object into an array of errors that can be used as JSON data.
