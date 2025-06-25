export enum SlashCommandCode {
  Reset = 99,
  Who = 1,
  Stats = 2,
  Fix = 3,
}

export enum CardCommandCode {
  Cancel = 'cancelInteraction',
  Reset = 'resetBreakfasts'
}

export interface OnCommand {
  execute: (...args: any) => Promise<any>
}

