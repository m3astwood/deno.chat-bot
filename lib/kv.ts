import { SpaceMember } from '../types/Data.ts'

const KV = await Deno.openKv()

export async function writeMembers(members: SpaceMember[]) {
  await KV.set(['members'], members.map(m => ({ ...members, breakfasts: 0 })))
}

export function getSavedMembers() {
  return KV.list({ prefix: ['members'] })
}
