import { writeMembers } from '../lib/kv.ts'
import { getMembers } from '../lib/api.ts'
import { Commands, OnCommand } from '../types/Commands.ts'
import { chooseTwoUsers } from '../lib/Chooser.ts'

export const SlashCommands: Map<Commands, OnCommand> = new Map()

/*
 * The /who command
 *
 * if it has been run already since the last wednesday, do not run
 * rather show who was already chosen
 *
 * note > need a replace one/two of selected function if there needs
 * to be a modification. This could be random or intentional
 *
 * otherwise
 *
 * get all members of the space and select two at random (MVP)
 * - at least do not select the last two who were selected
 *
 * stretch goals
 * - have a list of all users that have been selected already
 * - weight the selection in their favour to not be chosen
 */
SlashCommands.set(Commands.Who, {
  execute: async (spaceName: string) => {
    try {
      console.log('Getting members for space:', spaceName)
      const members = await getMembers(spaceName)

      // write new members to KV
      const savedMembers = await writeMembers(members)

      const [ personOne, personTwo ] = chooseTwoUsers(savedMembers)

      console.log('personOne :', personOne)
      console.log('personTwo :', personTwo)

      return `Bonjour, semaine prochaine le petit dej est fourni par : <${personOne.name}> et <${personTwo.name}>!`
    } catch (error) {
      console.error('Error in whoIs:', error)
      throw error
    }
  },
})
