import { Hono } from 'hono'
import { EventType, GoogleChatEvent } from './types/Events.ts'
import { SlashCommands } from './controllers/commands.ts'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'PATOCHE' })
})

// Define a POST route for Google Chat events
app.post('/events', async (c) => {
  try {
    const event: GoogleChatEvent = await c.req.json()

    let returnObject = null

    if (event.type === EventType.Message) {
      const { slashCommand, text, space } = event.message

      if (slashCommand) {
        const commandId = Number(slashCommand.commandId)
        const cmd = SlashCommands.get(commandId)
        returnObject = await cmd?.execute(space.name)
      }
    } else if (event.type === EventType.CardClicked) {
      console.log(event.common)
      returnObject = { text: 'You have clicked a card, we are still working on implementing that functionality' }
    } else if (event.type === EventType.AddedToSpace) {
      returnObject = { text: `Thanks for adding me to this space, ${event.user.displayName}!` }
    }

    if (returnObject) {
      return c.json(returnObject)
    }
  } catch (error) {
    console.error('Error processing event:', error)
    return c.json({ text: 'Sorry, I encountered an error.' }, 500)
  }
})

app.all('*', (c) => {
  return c.json({ message: 'Not Found or Method Not Allowed' }, 404)
})

Deno.serve(app.fetch)
