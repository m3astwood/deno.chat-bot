import { writeMembers } from '../lib/Members.ts'
import { getMembers } from '../lib/api.ts'
import { Commands, OnCommand } from '../types/Commands.ts'
import { chooseTwoUsers } from '../lib/Chooser.ts'
import { consolidateMembers, updateMembers } from '../lib/Members.ts'

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

      const consolidatedMembers = await consolidateMembers(spaceName, members)

      console.log('consolidated', consolidatedMembers)

      const [personOne, personTwo] = chooseTwoUsers(consolidatedMembers)

      // update chosen members breakfasts
      const updatedMembers = updateMembers(consolidatedMembers, personOne, personTwo)

      console.log('updated', updatedMembers)

      // write members to KV
      await writeMembers(spaceName, updatedMembers)

      // return message
      return `Bonjour, semaine prochaine le petit dej est fourni par : <${personOne.name}> et <${personTwo.name}>!`
    } catch (error) {
      console.error('Error in whoIs:', error)
      throw error
    }
  },
})

/*
 * The /reset command
 *
 * this resets the breakfasts for all users in the chat,
 * you will be prompted with a are you sure and can only be
 * run by the chat group admin.
 *
 * If you're not admin you'll get a friendly response
 */
SlashCommands.set(Commands.Reset, {
  execute: async (spaceName: string) => {
    // send verification...
    // get members
    // set all members' breakfasts to O
    // return a message
    return `test reset...`
  },
})

// /**
//  * Opens the second step of the dialog that lets users confirm details.
//  *
//  * @param {Object} event The event object from the Google Workspace add-on.
//  * @return {Object} update the dialog.
//  */
// function openConfirmationDialog(event) {
//   // Retrieve the form input values
//   const name = event.commonEventObject.formInputs['contactName'].stringInputs.value[0]
//   return {
//     action: {
//       navigations: [{
//         pushCard: {
//           sections: [{
//             widgets: [
//               {
//                 // Display the input values for confirmation
//                 textParagraph: { text: '<b>Name:</b> ' + name },
//               },
//               WIDGETS,
//               {
//                 buttonList: {
//                   buttons: [{
//                     text: 'SUBMIT',
//                     onClick: {
//                       action: {
//                         // Use runtime environment variable set with self URL
//                         function: process.env.BASE_URL,
//                         parameters: [{
//                           key: 'actionName',
//                           value: 'submitDialog',
//                         }, {
//                           // Pass input values as parameters for last dialog step (submission)
//                           key: 'contactName',
//                           value: name,
//                         }],
//                       },
//                     },
//                   }],
//                 },
//               },
//             ],
//           }],
//         },
//       }],
//     },
//   }
// }
