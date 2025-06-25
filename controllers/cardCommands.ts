import { CardCommandCode, OnCommand } from '../types/Commands.ts'

export const CardCommands: Map<string, OnCommand> = new Map()

CardCommands.set(CardCommandCode.Reset, (spaceName: string) => {

})

CardCommands.set(CardCommandCode.Reset, () => {

})
