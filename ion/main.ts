import { readdirSync } from 'fs'
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { NewMessage, NewMessageEvent } from 'telegram/events'

import config, { prefix } from '../lib/config'
import { Module } from './handlers/module'
import { setup } from '../lib/setup'

const modules = readdirSync(__dirname + '/modules')

class Ion {
  config = config
  client?: TelegramClient

  constructor() {
    this.init()
  }

  async init() {
    const { app } = await this.config()
    if (app) {
      const { apiId, apiHash, session } = app
      const sessionString = new StringSession(session)
      this.client = new TelegramClient(sessionString, apiId, apiHash, {
        connectionRetries: 5,
      })

      this.start()
    } else {
      setup().then(this.init)
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
                const reg = new RegExp(`^${prefix}${name}\s?(.*)`)
                const match = event.message.message.match(reg)

                if (!match) return false
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
