// Ping command

import { version } from '../../lib/config'
import { Module } from '../handlers/module'

const ping = new Module()

ping.command('ping', (ctx) => {
  ctx.message.edit({ text: `Ion v${version} is up and running.` })
})

export const meta = {
  type: 'command',
  match: 'ping',
}

export default ping
