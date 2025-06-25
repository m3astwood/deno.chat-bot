import { SpaceMember } from '../types/Data.ts'

const KV = await Deno.openKv()

// FIX: Type the KVStore better to avoid these ignores
export async function writeMembers(spaceName: string, members: SpaceMember[]) {
  // first get existing members
  const { value } = await getSavedMembers(spaceName)

  // @ts-ignore : I know this is an array
  const existingNames = value?.map(m => m.name) || []
  const formattedMembersNew =  members.map(m => ({ name: m.member.name, displayName: m.member.displayName, breakfasts: 0 })).filter(m => !existingNames.includes(m.name))

  let updatedMembers
  if (value) {
    // @ts-ignore : I know this is an array
    updatedMembers = [ ...value, ...formattedMembersNew ]
  } else {
    updatedMembers = formattedMembersNew
  }

  // write all members to KV again
  await KV.set([spaceName, 'members'], updatedMembers)

  return updatedMembers
}

export async function getSavedMembers(spaceName: string) {
  return await KV.get([spaceName, 'members'])
}
