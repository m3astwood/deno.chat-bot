import { ofetch } from 'ofetch'
import Client from '../lib/auth.ts'

export const api = ofetch.create({
  baseURL: 'https://chat.googleapis.com/v1/',
  headers: {
    'Authorization': `Bearer ${Client.token}`
  },
})
