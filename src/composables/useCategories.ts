import {ref, onMounted} from 'vue'
import {client} from '@/sanity/sanity.ts'
import type {Category} from '@/types/category.ts'

export function useCategories() {
  const categories = ref<Category[]>([])
  const loading = ref(true)

  onMounted(async () => {
    try {
      categories.value = await client.fetch<Category[]>(`
        *[_type == "category"] | order(title asc) {
          _id, title, slug
        }
      `)
    } finally {
      loading.value = false
    }
  })

  return {categories, loading}
}
