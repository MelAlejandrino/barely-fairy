import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '3l6t6cdd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})
