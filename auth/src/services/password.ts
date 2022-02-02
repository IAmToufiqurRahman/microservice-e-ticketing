import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export class Password {
  // this toHash function take in some password, generate a salt, hash the password(buffer) along with the salt, and then we return both the hash password and the salt concatenated together
  static async toHash(password: string) {
    // generate a salt
    const salt = randomBytes(8).toString('hex')

    // buffer
    const buf = (await scryptAsync(password, salt, 64)) as Buffer

    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(storePassword: string, suppliedPassword: string) {
    const [hasdedPassword, salt] = storePassword.split('.')

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

    return buf.toString('hex') === hasdedPassword
  }
}

Password.toHash
Password.compare

// scrypt is callback based that's why we use promisify to take this callback based function and turn it into a promised based implementation
