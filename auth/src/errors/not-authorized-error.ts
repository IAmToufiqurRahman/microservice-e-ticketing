import { CustomError } from './custom-error'

export class NotAuthorizedError extends CustomError {
  statusCode = 401

  // the constructor is required to set up because we're ultimately extending a built in class through CustomError
  constructor() {
    super('Not authorized')

    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }]
  }
}
