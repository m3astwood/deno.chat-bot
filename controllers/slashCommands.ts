import { writeMembers } from '../lib/Members.ts'
import { getMembers } from '../lib/api.ts'
import { CardCommandCode, OnCommand, SlashCommandCode } from '../types/Commands.ts'
import { chooseTwoUsers } from '../lib/Chooser.ts'
import { consolidateMembers, updateMembers } from '../lib/Members.ts'
import { GoogleChatEvent } from '../types/Events.ts'
import { generateRichChatElement, generateSelectionInput } from '../lib/ChatElements.ts'

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
SlashCommands.set(SlashCommandCode.Who, {
  execute: async (event: GoogleChatEvent) => {
    try {
      const spaceName = event.space.name
      console.log('Getting members for space:', spaceName)
      const members = await getMembers(spaceName)

      const consolidatedMembers = await consolidateMembers(spaceName, members)

      // console.log('consolidated', consolidatedMembers)

      // const [personOne, personTwo] = chooseTwoUsers(consolidatedMembers)

      // update chosen members breakfasts
      // const updatedMembers = updateMembers(consolidatedMembers, personOne, personTwo)

      // console.log('updated', updatedMembers)

      // write members to KV
      // await writeMembers(spaceName, updatedMembers)

      // return exclusion dialog
      const returnValue = generateRichChatElement('card', {
        privateMessageViewer: {
          user: {
            name: event.user.name
          },
        },
        header: {
          title: 'Exclude users'
        },
        sections: [
          {
            collapsible: false,
            widgets: [
              {
                textParagraph: {
                  text: 'Select the following users who WILL NOT be included in the selection.',
                },
              },
              generateSelectionInput(
                'members',
                'CHECK_BOX',
                consolidatedMembers.map((m) => {
                  return {
                    text: m.displayName,
                    value: m.name,
                    selected: false,
                  }
                }),
              ),
              {
                buttonList: {
                  buttons: [
                    {
                      text: 'Choose',
                      onClick: {
                        action: {
                          function: CardCommandCode.Choose
                        }
                      }
                    }
                  ]
                }
              }
            ],
          },
        ],
      })

      console.log(returnValue)

      return returnValue
      // return { text: `Bonjour, semaine prochaine le petit dej est fourni par : <${personOne.name}> et <${personTwo.name}>!` }
    } catch (error) {
      console.error('Error in whoIs:', error)
      throw error
    }
  },
})

/*
 * The /reset command
 *
 * this prompty the reset breakfasts dialog,
 * you will be prompted with a are you sure and can only be
 * run by the chat group admin.
 *
 * If you're not admin you'll get a friendly response
 */
SlashCommands.set(SlashCommandCode.Reset, {
  execute: async (event: GoogleChatEvent) => {
    return {}
  },
})
