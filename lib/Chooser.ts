import { SavedMember } from '../types/Data.ts'
/**
 * Selects a single user from a list based on weighted probability.
 * Users with lower `breakfasts` counts have a higher chance of being chosen.
 *
 * @param {User[]} users - The array of users to choose from.
 * @returns {User | null} The selected user, or null if the input array is empty.
 */
const chooseOneWeighted = (users: SavedMember[]): SavedMember | null => {
  if (users.length === 0) {
    return null
  }

  const weightedUsers = users.map((user) => ({
    ...user,
    weight: 1 / (user.breakfasts + 1),
  }))

  const totalWeight = weightedUsers.reduce((sum, user) => sum + user.weight, 0)

  let random = Math.random() * totalWeight

  for (const user of weightedUsers) {
    random -= user.weight
    if (random <= 0) {
      return { name: user.name, displayName: user.displayName, breakfasts: user.breakfasts } // Return the original user object
    }
  }

  return users[Math.floor(Math.random() * users.length)]
}

/**
 * Randomly chooses two distinct users from an array, weighted in favour of
 * users that have the least breakfasts.
 *
 * @param {User[]} users - The array of user objects.
 * @throws {Error} If the input array has fewer than two users.
 * @returns {[User, User]} A tuple containing the two chosen users.
 */
export const chooseTwoMembers = (users: SavedMember[], exclude: string[] = []): { chosen?: [SavedMember, SavedMember], error?: string  } => {
  if (users.length < 2) {
    return { error: 'The user array must contain at least two users.' }
  }

  const filteredMembers = users.filter(u => !exclude.includes(u.name))

  if (filteredMembers.length < 2) {
    return { error: 'The filteredMembers array must contain at least two users.' }
  }

  const firstUser = chooseOneWeighted(filteredMembers)

  const remainingUsers = filteredMembers.filter((user) => user.name !== firstUser!.name)

  const secondUser = chooseOneWeighted(remainingUsers)

  firstUser!.breakfasts += 1
  secondUser!.breakfasts += 1

  return { chosen: [firstUser!, secondUser!] }
}
