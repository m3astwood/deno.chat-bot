import { writeMembers } from '../lib/Members.ts'
import { getMembers } from '../lib/api.ts'
import { CardCommandCode, OnCommand, SlashCommandCode } from '../types/Commands.ts'
import { chooseTwoMembers } from '../lib/Chooser.ts'
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

      // return exclusion dialog
      const returnValue = generateRichChatElement('card', {
        header: {
          title: 'Exclude users',
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
                          function: CardCommandCode.Choose,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      })

      return {
        privateMessageViewer: {
          name: event.user.name,
        },
        ...returnValue,
      }
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
    // return exclusion dialog
    const returnValue = generateRichChatElement('card', {
      id: 'ResetCardPrompt',
      header: {
        title: 'Exclude users',
      },
      sections: [
        {
          collapsible: false,
          widgets: [
            {
              textParagraph: {
                text: 'By clicking reset you will set the breakfast count for all members in this channel to zero.',
              },
            },
            {
              buttonList: {
                buttons: [
                  {
                    text: 'Cancel',
                    onClick: {
                      action: {
                        function: CardCommandCode.Cancel,
                        parameters: [{
                          key: 'cardCommand',
                          value: CardCommandCode.Reset,
                        }],
                      },
                    },
                  },
                  {
                    text: 'Reset',
                    onClick: {
                      action: {
                        function: CardCommandCode.Reset,
                      },
                    },
                    icon: {
                      materialIcon: {
                        name: 'delete',
                      },
                    },
                    color: {
                      red: 1,
                      green: 0,
                      blue: 0,
                      alpha: 1,
                    },
                    type: 'FILLED',
                  },
                ],
              },
            },
          ],
        },
      ],
    })

    return {
      privateMessageViewer: {
        name: event.user.name,
      },
      ...returnValue,
    }
  },
})
