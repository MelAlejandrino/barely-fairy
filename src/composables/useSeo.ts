import {useHead} from '@unhead/vue'

interface SeoOptions {
  title?: string
  description?: string
  ogImage?: string
  url?: string
}

const SITE_NAME = 'Barely Fairy'
const DEFAULT_DESCRIPTION = 'Handmade crochet pieces crafted with care and love 🌸'
const DEFAULT_OG_IMAGE = 'https://barely-fairy.vercel.app/og-default.jpg'

export function useSeo(options: SeoOptions = {}) {
  const title = options.title ? `${options.title} — ${SITE_NAME}` : SITE_NAME
  const description = options.description ?? DEFAULT_DESCRIPTION
  const ogImage = options.ogImage ?? DEFAULT_OG_IMAGE

  useHead({
    title,
    meta: [
      {name: 'description', content: description},

      // Open Graph
      {property: 'og:title', content: title},
      {property: 'og:description', content: description},
      {property: 'og:image', content: ogImage},
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: SITE_NAME},

      // Twitter
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: title},
      {name: 'twitter:description', content: description},
      {name: 'twitter:image', content: ogImage},
    ]
  })
}
