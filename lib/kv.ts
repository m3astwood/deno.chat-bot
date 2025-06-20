import { SpaceMember } from '../types/Data.ts'

const KV = await Deno.openKv()

export async function writeMembers(members: SpaceMember[]) {
  for await (const member of members) {
    const existing = await KV.get(['members', member.name])
    if (!existing) {
      await KV.set(['members', member.name], {
        name: member.member.displayName,
        breakfasts: 0,
      })
    }
  }
}

export async function getSavedMembers() {
  return await KV.get(['members'])
}
