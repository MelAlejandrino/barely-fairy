import {ref, onMounted} from 'vue'
import {client} from '@/sanity/sanity.ts'
import type {Post} from '@/types/post.ts'

export function usePost(slug: string) {
  const post = ref<Post | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)

  onMounted(async () => {
    try {
      post.value = await client.fetch<Post>(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    publishedAt,
    body,
    linkedProducts[]->{
      _id,
      title,
      slug,
      price,
      hasVariants,
      variants,
      inStock,
      featured_image
    },
    seo
  }
`, {slug})
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  })

  return {post, loading, error}
}
