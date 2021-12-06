import { readdirSync } from 'fs'
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { NewMessage, NewMessageEvent } from 'telegram/events'

import config, { prefix } from '../lib/config'
import { Module } from './handlers/module'

const modules = readdirSync(__dirname + '/modules')

class Ion {
  config = config
  client?: TelegramClient

  constructor() {
    if (this.config.app) {
      const { id, hash, session } = this.config.app
      const sessionString = new StringSession(session)
      this.client = new TelegramClient(sessionString, id, hash, {
        connectionRetries: 5,
      })

      this.start()
    }
  }

  async start() {
    if (!this.client) return
    await this.client.connect()

    modules.forEach((m) => {
      import(`./modules/${m}`).then((f) => {
        const module: Module = f.default
        module.commands.map((c) => {
          const { name, context } = c

          this.client?.addEventHandler(
            (event) => {
              context(event)
            },
            new NewMessage({
              outgoing: true,
              incoming: false,
              func: (event: NewMessageEvent) => {
                const reg = new RegExp(`^${prefix}${name}`)
                const match = event.message.message.match(reg)

                console.log('match', match)

                return true
              },
            })
          )
        })
      })
    })
  }
}

export { Ion }
