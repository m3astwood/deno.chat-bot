export enum Commands {
  Who = 1
}

export interface OnCommand {
  execute: (...args: any) => Promise<any>
}

