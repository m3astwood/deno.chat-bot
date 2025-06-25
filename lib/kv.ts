import { SpaceMember } from '../types/Data.ts'

const KV = await Deno.openKv()

// FIX: Type the KVStore better to avoid these ignores
export async function writeMembers(members: SpaceMember[]) {
  // first get existing members
  const { value } = await getSavedMembers()

  // @ts-ignore : I know this is an array
  const existingNames = value?.map(m => m.name)
  const formattedMembersNew =  members.map(m => ({ name: m.member.name, displayName: m.member.displayName, breakfasts: 0 })).filter(m => !existingNames.includes(m.name))

  // @ts-ignore : I know this is an array
  const updatedMembers = [ ...value, ...formattedMembersNew ]

  // write all members to KV again
  await KV.set(['members'], updatedMembers)

  return updatedMembers
}

export async function getSavedMembers() {
  return await KV.get(['members'])
}
