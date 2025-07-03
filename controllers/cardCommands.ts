import { CardCommandCode, OnCommand } from '../types/Commands.ts'

export const CardCommands: Map<string, OnCommand> = new Map()

CardCommands.set(CardCommandCode.Reset, {
  execute: async (spaceName: string) => {},
})

CardCommands.set(CardCommandCode.Choose, {
  execute: async (event) => {
    console.log(event.common.formInputs)

    return event
  },
})
