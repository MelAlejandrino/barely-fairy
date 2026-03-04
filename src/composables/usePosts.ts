import { ref, onMounted, computed } from 'vue'
import { client } from '@/sanity/sanity.ts'
import type { Post } from '@/types/post.ts'

const PAGE_SIZE = 5

export function usePosts() {
  const posts = ref<Post[]>([])
  const loading = ref(true)
  const error = ref<Error | null>(null)
  const currentPage = ref(1)
  const totalCount = ref(0)

  const totalPages = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

  async function fetchPosts() {
    loading.value = true
    try {
      const start = (currentPage.value - 1) * PAGE_SIZE

      const [result, count] = await Promise.all([
        client.fetch<Post[]>(`
          *[_type == "post"] | order(publishedAt desc) [${start}...${start + PAGE_SIZE}] {
            _id, _type, title, slug, publishedAt, body, seo
          }
        `),
        client.fetch<number>(`count(*[_type == "post"])`),
      ])

      posts.value = result
      totalCount.value = count
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    fetchPosts()
  }

  onMounted(fetchPosts)

  return { posts, loading, error, currentPage, totalPages, goToPage }
}
