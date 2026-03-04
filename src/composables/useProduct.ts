import { ref, onMounted } from 'vue'
import { client } from '@/sanity/sanity.ts'
import type { Product } from '@/types/product.ts'

export function useProduct(slug: string) {
  const product = ref<Product | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)

  onMounted(async () => {
    try {
      product.value = await client.fetch<Product>(
        `
        *[_type == "product" && slug.current == $slug][0] {
          _id,
          _type,
          title,
          slug,
          publishedAt,
          category->{_id, title},
          hasVariants,
          variants,
          price,
          stock,
          inStock,
          featured_image,
          gallery,
          description,
          tags,
          seo
        }
      `,
        { slug },
      )
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  })

  return { product, loading, error }
}
