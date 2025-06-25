export enum Commands {
  Reset = 99,
  Who = 1,
  Stats = 2,
  Fix = 3,
}

export interface OnCommand {
  execute: (...args: any) => Promise<any>
}

