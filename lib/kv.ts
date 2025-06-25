import { SpaceMember } from '../types/Data.ts'

const KV = await Deno.openKv()

// FIX: Type the KVStore better to avoid these ignores
export async function writeMembers(members: SpaceMember[]) {
  // first get existing members
  const { value } = await getSavedMembers()

  // @ts-ignore : I know this is an array
  const existingNames = value?.map(m => m.name)

  const formattedMembers =  members.map(m => ({ name: m.name, displayName: m.member.displayName, breakfasts: 0 })).filter(m => !existingNames.includes(m.name))

  // loop through existing members and passed members to add non existent
  console.log('existing :', existingNames)
  console.log('formatted :', formattedMembers)

  // @ts-ignore : I know this is an array
  const updatedMembers = [ ...value, ...formattedMembers ]

  // write all members to KV again
  await KV.set(['members'], updatedMembers)

  return updatedMembers
}

export async function getSavedMembers() {
  return await KV.get(['members'])
}
