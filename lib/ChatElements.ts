import { CardDialogHeader } from '../types/ChatElements.ts'

export function generateSelectionInput(name: string, type: 'CHECK_BOX' | 'RADIO_BUTTON' | 'SWITCH', items: any[]) {
  if (!name || !type || items.length === 0) {
    throw new Error('Missing name, type or items for selectionInput')
  }

  return {
    selectionInput: {
      name,
      type,
      items,
    },
  }
}

export function generateRichChatElement(elementType: 'card' | 'dialog', parts: { header?: CardDialogHeader; sections: any[]; [key: string]: any }) {
  const type = elementType.toUpperCase()
  const typeKey = elementType === 'card' ? 'cardsV2' : 'dialog'
  const typeActionKey = `${elementType}Action`
  const typeIdKey = `${elementType}Id`

  return {
    [typeKey]: [
      {
        [typeIdKey]: `${crypto.randomUUID()}-${elementType}`,
        [elementType]: {
          sections: parts.sections,
        },
      },
    ],
  }
}

// {
//   header: 'Are you sure you want to reset all breakfasts?',
//   collapsible: false,
//   uncollapsibleWidgetsCount: 1,
//   widgets: [
//     {
//       textParagraph: {
//         text:
//           'By pressing the reset button you will revert all breakfasts to zero. This action is irreversible, are you sure you want to continue ?',
//         maxLines: 2,
//       },
//     },
//     {
//       buttonList: {
//         buttons: [
//           {
//             text: 'No thank you',
//             type: 'OUTLINED',
//             onClick: {
//               action: {
//                 function: CardCommandCode.Cancel,
//                 parameters: [
//                   {
//                     key: 'functionName',
//                     value: CardCommandCode.Reset,
//                   },
//                 ],
//               },
//             },
//           },
//           {
//             text: 'RESET!',
//             icon: {
//               materialIcon: {
//                 name: 'delete',
//               },
//             },
//             color: {
//               red: 1,
//               green: 0,
//               blue: 0,
//               alpha: 1,
//             },
//             type: 'FILLED',
//             onClick: {
//               action: {
//                 function: CardCommandCode.Reset,
//               },
//             },
//           },
//         ],
//       },
//     },
//   ],
// },
