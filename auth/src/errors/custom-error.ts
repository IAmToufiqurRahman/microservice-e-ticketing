export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): { message: string; field?: string }[]
}

// serializeErrors(), the goal of this method is to take all the information about the error and then return some array of objects that follow the common error structure
