import 'dotenv/config'
import next from 'next'
import express, { Request, Response } from 'express'
import { Ion } from './main'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

const start = async () => {
  new Ion()

  try {
    await app.prepare()
    const server = express()

    server.all('*', (req: Request, res: Response) => {
      return handle(req, res)
    })

    server.listen(port, (err?: any) => {
      if (err) throw err
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

start()
