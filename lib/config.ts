import { readFileSync } from 'fs'
import { Config } from '../types'

let config: Config = {}

try {
  config = JSON.parse(readFileSync('./config.json', 'utf8'))
} catch (e) {}

export default config

export const prefix = '.'

let packageJson = { version: '0.0.0' }

if (process.env.NODE_ENV === 'development') {
  packageJson = require('../package.json')
} else {
  packageJson = require('../../package.json')
}

export const version = packageJson.version
