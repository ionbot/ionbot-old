// Ping command

import { Module } from '../handlers/module'

const ping = new Module()

ping.command('ping', (ctx) => {
  ctx.message.edit({ text: 'Pong' })
})

export const meta = {
  type: 'command',
  match: 'ping',
}

export default ping
