import { Hono } from 'hono'
import { EventType, GoogleChatEvent } from './types/Events.ts'
import { Commands } from './types/Commands.ts'
import { whoIs } from './controllers/commands.ts'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    message: 'test edge server',
  })
})

// Define a POST route for Google Chat events
app.post('/events', async (c) => {
  try {
    const event: GoogleChatEvent = await c.req.json()

    let responseText = 'Hello from your Deno Hono bot!'

    if (event.type === EventType.Message) {
      const message = event.message

      if (message.slashCommand) {
        switch (Number(message.slashCommand.commandId)) {
          case Commands.Who:
            responseText = (await whoIs(message.space.name)).map((member) =>
              `${member.member?.displayName} (${member.member?.email}) - Type: ${member.member?.type}`
            ).join(', ')
            break
          default:
            responseText =
              `You requested an un implemented command ${message.text} (${message.slashCommand.commandId})`
            break
        }
      } else if (message.text) {
        responseText = `You said: "${message.text}"`

        if (message.text.includes('hello bot')) {
          responseText = `Hi there, ${event.user.displayName}!`
        }
      }
    } else if (event.type === EventType.AddedToSpace) {
      responseText =
        `Thanks for adding me to this space, ${event.user.displayName}!`
    }

    return c.json({ text: responseText })
  } catch (error) {
    console.error('Error processing event:', error)
    return c.json({ text: 'Sorry, I encountered an error.' }, 500)
  }
})

app.all('*', (c) => {
  console.log('message to unknown endpoint', c.req.path)
  return c.json({ message: 'Not Found or Method Not Allowed' }, 404)
})

Deno.serve(app.fetch)
