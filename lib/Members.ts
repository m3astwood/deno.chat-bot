import { SpaceMember } from '../types/Data.ts'

const KV = await Deno.openKv()

export async function writeMembers(spaceName: string, members: SpaceMember[]) {
  // write all members to KV again
  await KV.set([spaceName, 'members'], members)
}

export async function getSavedMembers(spaceName: string) {
  return await KV.get([spaceName, 'members'])
}

export function updateMembers(originalMembers: SavedMembers[], ...newMembers: SavedMember[]) {
  const filteredMembers = originalMembers.filter(om => {
    return !newMembers.find(nm => nm.name === om.name)
  })

  return [ ...filteredMembers, ...newMembers ]
}

export async function consolidateMembers(spaceName: string, members: SpaceMember[]) {
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

  return updatedMembers
}
