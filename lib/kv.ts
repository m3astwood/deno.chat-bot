import { SpaceMember } from '../types/Data.ts'

const KV = await Deno.openKv()

export async function writeMembers(members: SpaceMember[]) {
}

export function getSavedMembers() {
  return KV.list({ prefix: ['members'] })
}
