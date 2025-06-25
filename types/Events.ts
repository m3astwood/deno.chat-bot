export enum EventType {
  AddedToSpace = 'ADDED_TO_SPACE',
  Message = 'MESSAGE',
  RemovedFromSpace = 'REMOVED_FROM_SPACE',
  CardClicked = 'CARD_CLICKED',
  Action = 'ACTION',
  AppCommand = 'APP_COMMAND'
}

export enum DialogEventType {
  RequestDialog = 'REQUEST_DIALOG'
}

export enum SpaceType {
  Room = 'SPACE',
  DM = 'DM'
}

export enum UserType {
  Human = 'HUMAN',
  Bot = 'BOT'
}

export interface GoogleChatEvent {
  common: CommonEventData
  space: Space
  user: User
  configCompleteRedirectUrl: string
  message: Message
  thread: {
    retentionSettings: unknown[]
    name: string
  }
  type: EventType
  eventTime: string
  appCommandMetadata: {
    appCommandId: number
    appCommandType: string
  }
  isDialogEvent?: boolean
  dialogEventType?: DialogEventType
}

interface CommonEventData {
  hostApp: string
  userLocale: string
  timeZone: {
    id: string
    offset: number
  }
  parameters?: any
  invokedFunction?: string
}


interface Space {
  lastActiveTime: string
  spaceType: string
  spaceHistoryState: string
  spaceThreadingState: string
  type: SpaceType
  membershipCount: { joinedDirectHumanUserCount: number }
  spaceUri: string
  name: string
  displayName: string
}

interface User {
  email: string
  domainId: string
  avatarUrl: string
  name: string
  displayName: string
  type: UserType
}

interface Message {
  text: string
  annotations: unknown[]
  thread: {
    retentionSettings: unknown[]
    name: string
  }
  space: Space
  slashCommand?: {
    commandId: number
  }
  sender: User
  formattedText: string
  messageHistoryState: string
  name: string
  retentionSettings: {
    state: string
  }
  createTime: string
}
