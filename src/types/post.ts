import type { PortableTextBlock, Image } from '@sanity/types'
import type { Product } from './product'

interface Post {
  _id: string
  _type: 'post'
  title: string
  slug: { _type: 'slug'; current: string }
  publishedAt: string
  body: PortableTextBlock[]
  linkedProducts?: { _ref: string; _type: 'reference' }[] | Product[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: Image
  }
}

export type { Post }
