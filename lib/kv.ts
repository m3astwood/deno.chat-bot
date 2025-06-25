import { SpaceMember } from '../types/Data.ts'

const KV = await Deno.openKv()

export async function writeMembers(members: SpaceMember[]) {
  // first get existing members
  const { value: existing } = await getSavedMembers()

  // loop through existing members and passed members to add non existent
  console.log('existing :', existing)

  // write all members to KV again
  await KV.set(['members'], members.map(m => ({ name: m.name, displayName: m.member.displayName, breakfasts: 0 })))
}

export async function getSavedMembers() {
  return await KV.get(['members'])
}
