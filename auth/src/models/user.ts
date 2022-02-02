import mongoose from 'mongoose'

import { Password } from '../services/password'

// An interface that describes the properties required to create a new user, Attrs short for attributes, created this interface to force effective type checking into userSchema model
interface UserAttrs {
  email: string
  password: string
}

// An interface that describes the properties a User Document has
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

// An interface that describes the properties a User Model has, tells typescript that there is a build function available on this User Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(arrts: UserAttrs): UserDoc
}

// Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },

  // to customize the response object
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      }
    }
  }
)

// This is a middleware function implemented in mongoose, anytime we attempt to save a document to our database, we're going to execute this function right here, Mongoose doesn't have good support for async-await syntax, the "done" argument is there to handle any kind of asynchronous code that we run inside the callback function
userSchema.pre('save', async function (done) {
  // hash the password if it has been modified, the first time also
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))

    this.set('password', hashed)
  }

  done()
})

// custom function build into model for effective type checking with typescript
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

// const user = User.build({
//   email: 'test@test.com',
//   password: 'anakanananan'
// })

// <UserDoc, UserModel> --->> these are generics things, we can think it as types being provided to a functions as arguments
