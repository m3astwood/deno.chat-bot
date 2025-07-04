import { getMembers, updateMessage } from '../lib/api.ts'
import { chooseTwoMembers } from '../lib/Chooser.ts'
import { consolidateMembers, updateMembers, writeMembers } from '../lib/Members.ts'
import { CardCommandCode, OnCommand } from '../types/Commands.ts'
import { GoogleChatEvent } from '../types/Events.ts'

export const CardCommands: Map<string, OnCommand> = new Map()

CardCommands.set(CardCommandCode.Cancel, {
  execute: async (event, params) => {
    return { text: `CANCEL ${params}!!!!` }
  },
})

CardCommands.set(CardCommandCode.Reset, {
  execute: async (event: GoogleChatEvent, params) => {
    console.log(event.common)
    console.log(event.message)

    const { success, error } = updateMessage({
      name: event.message.name,
      updateMask: [
        'cardssV2'
      ],
      cardsV2: [],
      text: 'Reset successful.'
    })

    if (error) {
      throw Error('SOMETHING WENT WRONG IN MESSAGE UPDATE')
    }

    return { ...success }
  },
})

CardCommands.set(CardCommandCode.Choose, {
  execute: async (event) => {
    const { members: { stringInputs: { value: toExclude } } } = event.common.formInputs

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

    const { chosen, error } = chooseTwoMembers(consolidatedMembers, toExclude)
    if (error) {
      return {
        privateMessageViewer: {
          name: event.user.name,
        },
        text: error,
      }
    }

    if (!chosen) {
      throw Error('Something has gone wrong with breakfast selection')
    }

    const [personOne, personTwo] = chosen
    // update chosen members breakfasts
    const updatedMembers = updateMembers(consolidatedMembers, personOne, personTwo)

    console.log('updated', updatedMembers)

    // write members to KV
    await writeMembers(spaceName, updatedMembers)

    // return message
    return { text: `Bonjour, semaine prochaine le petit dej est fourni par : <${personOne.name}> et <${personTwo.name}>!` }
  },
})
