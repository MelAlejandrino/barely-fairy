import type { PortableTextBlock, Image } from '@sanity/types'
import type { Category } from './category'

// Variant interface
interface ProductVariant {
  size: 'small' | 'medium' | 'large'
  price: number
  stock: number
}

// SEO interface
interface ProductSEO {
  metaTitle?: string
  metaDescription?: string
  ogImage?: Image
}

interface Product {
  _id: string
  _type: 'product'
  title: string
  slug: {
    _type: 'slug'
    current: string
  }
  publishedAt: string
  category: Category
  hasVariants: boolean
  variants?: ProductVariant[] // present only if hasVariants === true
  price?: number // present only if hasVariants === false
  stock?: number // present only if hasVariants === false
  inStock: boolean // read-only, auto-calculated
  featured_image?: Image
  gallery?: Image[]
  description?: PortableTextBlock[]
  seo?: ProductSEO
  tags?: string[]
  _createdAt?: string
  _updatedAt?: string
  _rev?: string
}

export type { Product, ProductSEO, ProductVariant }
