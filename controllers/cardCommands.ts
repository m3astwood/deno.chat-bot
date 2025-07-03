import { getMembers } from '../lib/api.ts'
import { chooseTwoUsers } from '../lib/Chooser.ts'
import { consolidateMembers, updateMembers, writeMembers } from '../lib/Members.ts'
import { CardCommandCode, OnCommand } from '../types/Commands.ts'

export const CardCommands: Map<string, OnCommand> = new Map()

CardCommands.set(CardCommandCode.Reset, {
  execute: async (spaceName: string) => {},
})

CardCommands.set(CardCommandCode.Choose, {
  execute: async (event) => {
    console.log(event.common.formInputs)

    // {
    //   members: {
    //     stringInputs: {
    //       value: [ "users/114134330763224107043", "users/103965345231025561001" ]
    //     }
    //   }
    // }
    const spaceName = event.space.name
    console.log('Getting members for space:', spaceName)
    const members = await getMembers(spaceName)

    const consolidatedMembers = await consolidateMembers(spaceName, members)

    console.log('consolidated', consolidatedMembers)

    const [personOne, personTwo] = chooseTwoUsers(consolidatedMembers)

    // update chosen members breakfasts
    const updatedMembers = updateMembers(consolidatedMembers, personOne, personTwo)

    console.log('updated', updatedMembers)

    // write members to KV
    await writeMembers(spaceName, updatedMembers)

    // return message
    return { text: `Bonjour, semaine prochaine le petit dej est fourni par : <${personOne.name}> et <${personTwo.name}>!` }
  },
})
