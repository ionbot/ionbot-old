import { NewMessageEvent } from 'telegram/events'

type ModuleContext = (c: NewMessageEvent) => void

class Module {
  public commands: any[] = []

  command(name: string, context: ModuleContext): void {
    this.commands.push({ name, context })
  }
}

export { Module }
