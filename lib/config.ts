import { User } from '.prisma/client'
import { prisma } from './prisma'

const config = async () => {
  let app: User | null = null

  const user = await prisma.user.findFirst()
  if (user) {
    app = user
  }

  return { app }
}

export default config

export const prefix = '.'

let packageJson = { version: '0.0.0' }

if (process.env.NODE_ENV === 'development') {
  packageJson = require('../package.json')
} else {
  packageJson = require('../../package.json')
}

export const version = packageJson.version
