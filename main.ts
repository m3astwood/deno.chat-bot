import { Hono } from 'hono'
import Client from './lib/auth.ts'

const app = new Hono()
const client = Client

app.get('/', (c) => {
  return c.json({
    message: 'test edge server',
  })
})

// Define a POST route for Google Chat events
app.post('/events', async (c) => {
  try {
    const event = await c.req.json()
    console.log(
      'Received Google Chat Event:',
      JSON.stringify(event, null, 2),
    )

    let responseText = 'Hello from your Deno Hono bot!'

    if (event.type === 'MESSAGE') {
      const message = event.message
      if (message.text) {
        responseText = `You said: "${message.text}"`

        if (message.text.includes('hello bot')) {
          responseText = `Hi there, ${event.user.displayName}!`
        }
      }
    } else if (event.type === 'ADDED_TO_SPACE') {
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
