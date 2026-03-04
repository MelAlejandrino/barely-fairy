import {ref, onMounted, computed, watch} from 'vue'
import {client} from '@/sanity/sanity.ts'
import type {Product} from '@/types/product.ts'

const PAGE_SIZE = 5

export function useProducts(filters?: {
  categoryId?: ReturnType<typeof ref<string | null>>
  maxPrice?: ReturnType<typeof ref<number>>
  search?: ReturnType<typeof ref<string>>
}) {
  const products = ref<Product[]>([])
  const loading = ref(true)
  const error = ref<Error | null>(null)
  const currentPage = ref(1)
  const totalCount = ref(0)

  const totalPages = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

  async function fetchProducts() {
    loading.value = true
    try {
      const start = (currentPage.value - 1) * PAGE_SIZE

      const categoryFilter = filters?.categoryId?.value
        ? `&& category._ref == "${filters.categoryId.value}"`
        : ''

      const priceFilter = filters?.maxPrice?.value && filters.maxPrice.value < 1000
        ? `&& (
            (!hasVariants && price <= ${filters.maxPrice.value}) ||
            (hasVariants && count(variants[price <= ${filters.maxPrice.value}]) > 0)
          )`
        : ''

      const searchFilter = filters?.search?.value
        ? `&& title match "*${filters.search.value}*"`
        : ''

      const baseQuery = `*[_type == "product" ${categoryFilter} ${priceFilter} ${searchFilter}]`

      const [result, count] = await Promise.all([
        client.fetch<Product[]>(`
          ${baseQuery} | order(publishedAt desc) [${start}...${start + PAGE_SIZE + 1}] {
            _id, _type, title, slug, publishedAt,
            category->{_id, title},
            hasVariants, variants, price, stock, inStock,
            featured_image, tags, seo
          }
        `),
        client.fetch<number>(`count(${baseQuery})`)
      ])

      products.value = result.slice(0, PAGE_SIZE)
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
    fetchProducts()
  }

  watch(
    [
      () => filters?.categoryId?.value,
      () => filters?.maxPrice?.value,
      () => filters?.search?.value,  // 👈 watches debounced search
    ],
    () => {
      currentPage.value = 1
      fetchProducts()
    }
  )

  onMounted(fetchProducts)

  return {products, loading, error, currentPage, totalPages, goToPage}
}
