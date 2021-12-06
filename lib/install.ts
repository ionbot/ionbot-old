import inquirer from 'inquirer'
import { writeFileSync } from 'fs'
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'

const install = async () => {
  const stringSession = new StringSession('')

  const questions = [
    {
      type: 'input',
      name: 'apiId',
      message: "What's your Api ID",
    },
    {
      type: 'input',
      name: 'apiHash',
      message: "What's your Api Hash",
    },
  ]

  const answers = await inquirer.prompt(questions)

  const apiId = Number(answers.apiId)
  const apiHash = answers.apiHash

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  })

  await client.start({
    phoneNumber: async () => {
      const question = [
        {
          type: 'input',
          name: 'phoneNumber',
          message: "What's your phone number",
        },
      ]
      const answers = await inquirer.prompt(question)

      return answers.phoneNumber
    },
    password: async () => {
      const question = [
        {
          type: 'password',
          name: 'password',
          message: "What's your 2FA password",
        },
      ]
      const answers = await inquirer.prompt(question)

      return answers.password
    },
    phoneCode: async () => {
      const question = [
        {
          type: 'input',
          name: 'phoneCode',
          message: "What's the OTP",
        },
      ]
      const answers = await inquirer.prompt(question)

      return answers.phoneCode
    },
    onError: (err) => console.log(err),
  })

  // save config to current woring directory
  const config = {
    app: {
      id: apiId,
      hash: apiHash,
      session: client.session.save(),
    },
  }
  writeFileSync(process.cwd() + '/config.json', JSON.stringify(config, null, 2))
}

export { install }
