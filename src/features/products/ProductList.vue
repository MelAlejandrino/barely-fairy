<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useProducts} from '@/composables/useProducts'
import {useCategories} from '@/composables/useCategories'
import {createImageUrlBuilder} from '@sanity/image-url'
import {client} from '@/sanity/sanity.ts'
import type {Image} from '@sanity/types'
import {Skeleton} from '@/components/ui/skeleton'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {Button} from '@/components/ui/button'
import {ArrowLeft, ArrowRight, Search} from 'lucide-vue-next'

const builder = createImageUrlBuilder(client)

function imageUrl(image: Image | undefined) {
  if (!image) return ''
  return builder.image(image).width(400).height(400).fit('crop').url()
}

const props = withDefaults(
  defineProps<{
    limit?: number
    label?: string
    paginate?: boolean
    search?: string
  }>(),
  {
    limit: undefined,
    label: 'Products',
    paginate: false,
    search: ''
  },
)

const searchQuery = ref(props.search)
watch(() => props.search, (val) => searchQuery.value = val)
const debouncedSearch = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = val
  }, 500)
})

// Filters
const selectedCategory = ref<string | null>(null)
const maxPrice = ref<number>(1000)

const {categories} = useCategories()
const {products, loading, error, currentPage, totalPages, goToPage} = useProducts({
  categoryId: selectedCategory,
  maxPrice,
  search: debouncedSearch
})

const displayedProducts = computed(() =>
  props.limit ? products.value.slice(0, props.limit) : products.value,
)

function formatPrice(product: (typeof products.value)[0]) {
  if (product.hasVariants && product.variants?.length) {
    const prices = product.variants.map((v) => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? `₱${min}` : `₱${min} – ₱${max}`
  }
  return product.price ? `₱${product.price}` : '—'
}

function selectCategory(id: string | null) {
  selectedCategory.value = id
}
</script>

<template>
  <div class="flex flex-col">

    <!-- Header -->
    <div class="flex items-baseline justify-between mb-6">
      <h1 class="text-2xl font-semibold tracking-wide text-rose-900">{{ label }}</h1>
      <Badge variant="outline"
             class="text-rose-300 border-rose-200 text-[10px] tracking-widest uppercase">
        {{ displayedProducts.length }} products
      </Badge>
    </div>

    <!-- Filters (always rendered, not inside v-else) -->
    <div v-if="paginate" class="flex flex-col gap-4 mb-8">
      <!-- Category filter -->
      <div class="flex gap-2 flex-wrap">
        <button @click="selectCategory(null)"
                :class="['px-3 py-1.5 rounded-full text-xs border transition-all duration-200',
            selectedCategory === null
              ? 'bg-rose-400 text-white border-rose-400'
              : 'border-rose-200 text-rose-400 hover:border-rose-300 hover:bg-rose-100/50']">
          All
        </button>
        <button v-for="cat in categories" :key="cat._id" @click="selectCategory(cat._id)"
                :class="['px-3 py-1.5 rounded-full text-xs border transition-all duration-200',
            selectedCategory === cat._id
              ? 'bg-rose-400 text-white border-rose-400'
              : 'border-rose-200 text-rose-400 hover:border-rose-300 hover:bg-rose-100/50']">
          {{ cat.title }}
        </button>
      </div>

      <!-- Price filter -->
      <div class="flex gap-2 flex-wrap">
        <button @click="maxPrice = 1000"
                :class="['px-3 py-1.5 rounded-full text-xs border transition-all duration-200',
            maxPrice === 1000
              ? 'bg-rose-400 text-white border-rose-400'
              : 'border-rose-200 text-rose-400 hover:border-rose-300 hover:bg-rose-100/50']">
          All prices
        </button>
        <button v-for="preset in [200, 300, 500, 800]" :key="preset" @click="maxPrice = preset"
                :class="['px-3 py-1.5 rounded-full text-xs border transition-all duration-200',
            maxPrice === preset
              ? 'bg-rose-400 text-white border-rose-400'
              : 'border-rose-200 text-rose-400 hover:border-rose-300 hover:bg-rose-100/50']">
          Under ₱{{ preset }}
        </button>
      </div>

      <!-- Search -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rose-300"/>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full pl-9 pr-4 py-2.5 rounded-full border border-rose-200 bg-white text-sm text-rose-800 placeholder:text-rose-300 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200 transition-all"
        />
      </div>
    </div>

    <Separator class="bg-rose-200/60 mb-2"/>

    <!-- Loading (inline, doesn't unmount filters) -->
    <div v-if="loading" class="flex flex-col gap-4 mt-2">
      <Skeleton v-for="n in 5" :key="n" class="h-20 w-full bg-rose-100/60 rounded-xl"/>
    </div>

    <!-- Error -->
    <div v-else-if="error"
         class="text-red-400 text-xs tracking-widest uppercase border border-red-200 rounded-lg px-6 py-4 mt-2">
      ✕ Failed to load products
    </div>

    <!-- Product rows -->
    <template v-else>
      <RouterLink
        v-for="(product, i) in displayedProducts"
        :key="product._id"
        :to="`/products/${product.slug.current}`"
        class="group flex items-center gap-4 py-5 border-b border-rose-200/60 hover:bg-rose-100/30 transition-colors duration-300 -mx-4 px-4"
      >
        <span class="text-[10px] text-rose-300 font-mono shrink-0 w-5 text-right">
          {{ String((currentPage - 1) * 5 + i + 1).padStart(2, '0') }}
        </span>

        <div class="w-12 h-12 rounded-xl overflow-hidden bg-rose-100 shrink-0">
          <img v-if="product.featured_image" :src="imageUrl(product.featured_image)"
               :alt="product.title"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          <div v-else class="w-full h-full flex items-center justify-center text-rose-300 text-xs">
            —
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <p
            class="text-base font-medium text-rose-800 group-hover:text-rose-900 transition-colors leading-snug truncate mb-1">
            {{ product.title }}
          </p>
          <div class="flex items-center gap-2 flex-wrap">
            <Badge variant="outline"
                   class="text-rose-300 border-rose-200 text-[9px] tracking-widest uppercase">
              {{ product.category?.title ?? '—' }}
            </Badge>
            <Badge variant="outline"
                   :class="product.inStock
                ? 'text-emerald-500 border-emerald-200 text-[9px] tracking-widest uppercase'
                : 'text-red-400 border-red-200 text-[9px] tracking-widest uppercase'">
              {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
            </Badge>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <span class="text-sm font-mono text-rose-700 group-hover:text-rose-900 transition-colors">
            {{ formatPrice(product) }}
          </span>
          <span
            class="text-rose-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all duration-300 text-sm">
            →
          </span>
        </div>
      </RouterLink>

      <!-- Pagination -->
      <div v-if="paginate && totalPages > 1" class="flex items-center justify-center gap-1 py-12">
        <Button variant="ghost" size="icon" :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
                class="text-rose-300 hover:text-rose-700 hover:bg-rose-100 disabled:opacity-20">
          <ArrowLeft class="w-4 h-4"/>
        </Button>
        <Button v-for="page in totalPages" :key="page" variant="ghost" size="icon"
                @click="goToPage(page)"
                :class="['text-xs w-8 h-8 transition-all duration-200',
            currentPage === page
              ? 'text-rose-700 bg-rose-100 border-b-2 border-rose-400'
              : 'text-rose-300 hover:text-rose-700 hover:bg-rose-100']">
          {{ page }}
        </Button>
        <Button variant="ghost" size="icon" :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
                class="text-rose-300 hover:text-rose-700 hover:bg-rose-100 disabled:opacity-20">
          <ArrowRight class="w-4 h-4"/>
        </Button>
      </div>
    </template>

  </div>
</template>
