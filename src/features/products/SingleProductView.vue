<script setup lang="ts">
import {useRoute} from 'vue-router'
import {PortableText} from '@portabletext/vue'
import {format} from 'date-fns'
import AppLayout from '@/layout/AppLayout.vue'
import {createImageUrlBuilder} from '@sanity/image-url'
import {client} from '@/sanity/sanity.ts'
import type {Image} from '@sanity/types'
import {ref, computed, watchEffect} from 'vue'
import type {ProductVariant} from '@/types/product.ts'
import {useProduct} from '@/composables/useProduct.ts'
import {Skeleton} from '@/components/ui/skeleton'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {Button} from '@/components/ui/button'
import {ArrowLeft} from 'lucide-vue-next'
import {useHead} from "@unhead/vue";

const builder = createImageUrlBuilder(client)

function imageUrl(image: Image | undefined, width = 800) {
  if (!image) return ''
  return builder.image(image).width(width).fit('crop').url()
}

const route = useRoute()
const slug = route.params.slug as string
const {product, loading, error} = useProduct(slug)

const activeImage = ref(0)
const allImages = computed(() => {
  const imgs: Image[] = []
  if (product.value?.featured_image) imgs.push(product.value.featured_image)
  if (product.value?.gallery?.length) imgs.push(...product.value.gallery)
  return imgs
})

const selectedVariant = ref<ProductVariant | null>(null)

function selectVariant(variant: ProductVariant) {
  selectedVariant.value = variant
}

const displayPrice = computed(() => {
  if (selectedVariant.value) return `₱${selectedVariant.value.price}`
  if (product.value?.hasVariants && product.value.variants?.length) {
    const prices = product.value.variants.map((v) => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? `₱${min}` : `₱${min} – ₱${max}`
  }
  return product.value?.price ? `₱${product.value.price}` : '—'
})

const displayStock = computed(() => {
  if (selectedVariant.value) return selectedVariant.value.stock
  return product.value?.stock ?? null
})

const isInStock = computed(() => {
  if (selectedVariant.value) return selectedVariant.value.stock > 0
  return product.value?.inStock ?? false
})

const components = {}

useHead({
  title: computed(() =>
    product.value?.seo?.metaTitle
      ? `${product.value.seo.metaTitle} — Barely Fairy`
      : product.value?.title
        ? `${product.value.title} — Barely Fairy`
        : 'Barely Fairy'
  ),
  meta: [
    {name: 'description', content: computed(() => product.value?.seo?.metaDescription ?? '')},
    {
      property: 'og:title',
      content: computed(() => product.value?.seo?.metaTitle ?? product.value?.title ?? '')
    },
    {
      property: 'og:description',
      content: computed(() => product.value?.seo?.metaDescription ?? '')
    },
    {
      property: 'og:image',
      content: computed(() => product.value?.seo?.ogImage
        ? builder.image(product.value.seo.ogImage).width(1200).height(630).url()
        : 'https://barely-fairy.vercel.app/og-default.jpg'
      )
    },
    {property: 'og:type', content: 'product'},
  ]
})

</script>

<template>
  <AppLayout>

    <!-- Loading -->
    <div v-if="loading" class="max-w-5xl">
      <Skeleton class="h-4 w-20 bg-rose-100 mb-10"/>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton class="aspect-square rounded-2xl bg-rose-100"/>
        <div class="flex flex-col gap-4">
          <Skeleton class="h-4 w-1/3 bg-rose-100"/>
          <Skeleton class="h-10 w-3/4 bg-rose-100"/>
          <Skeleton class="h-6 w-1/4 bg-rose-100"/>
          <Skeleton class="h-px w-full bg-rose-100 my-2"/>
          <Skeleton class="h-4 w-full bg-rose-100"/>
          <Skeleton class="h-4 w-5/6 bg-rose-100"/>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error"
         class="text-red-400 text-xs tracking-widest uppercase border border-red-200 rounded-lg px-6 py-4">
      ✕ Failed to load product
    </div>

    <!-- Product -->
    <div v-else-if="product" class="max-w-5xl">

      <!-- Back -->
      <Button variant="ghost" as-child
              class="text-rose-300 hover:text-rose-600 hover:bg-rose-100/50 mb-10 -ml-3 gap-2 text-xs tracking-widest uppercase">
        <RouterLink to="/products">
          <ArrowLeft class="w-3 h-3"/>
          Back to Products
        </RouterLink>
      </Button>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        <!-- Left: Images -->
        <div class="flex flex-col gap-4">
          <!-- Main image -->
          <div class="aspect-square rounded-2xl overflow-hidden bg-rose-100/50">
            <img
              v-if="allImages[activeImage]"
              :src="imageUrl(allImages[activeImage])"
              :alt="product.title"
              class="w-full h-full object-cover transition-all duration-500"
            />
            <div v-else
                 class="w-full h-full flex items-center justify-center text-rose-300 text-xs tracking-widest uppercase">
              No image
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="allImages.length > 1" class="flex gap-2 flex-wrap">
            <button
              v-for="(img, i) in allImages"
              :key="i"
              @click="activeImage = i"
              :class="[
                'w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200',
                activeImage === i
                  ? 'border-rose-400'
                  : 'border-rose-200/60 hover:border-rose-300'
              ]"
            >
              <img :src="imageUrl(img, 200)" :alt="`Image ${i + 1}`"
                   class="w-full h-full object-cover"/>
            </button>
          </div>
        </div>

        <!-- Right: Details -->
        <div class="flex flex-col gap-5">

          <!-- Category + date -->
          <div class="flex items-center gap-2 flex-wrap">
            <Badge variant="outline"
                   class="text-rose-300 border-rose-200 text-[9px] tracking-widest uppercase">
              {{ product.category?.title ?? '—' }}
            </Badge>
            <Badge variant="outline"
                   class="text-rose-300 border-rose-200 text-[9px] tracking-widest uppercase">
              {{ format(product.publishedAt, 'MMM dd, yyyy') }}
            </Badge>
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-semibold text-rose-900 leading-tight tracking-wide">
            {{ product.title }}
          </h1>

          <!-- Price -->
          <div class="text-2xl font-mono text-rose-700">
            {{ displayPrice }}
          </div>

          <!-- Stock status -->
          <div class="flex items-center gap-2">
            <span
              :class="['w-1.5 h-1.5 rounded-full', isInStock ? 'bg-emerald-400' : 'bg-red-400']"/>
            <span
              :class="['text-xs tracking-widest uppercase', isInStock ? 'text-emerald-500' : 'text-red-400']">
              {{
                isInStock ? `In Stock${displayStock ? ` (${displayStock} left)` : ''}` : 'Out of Stock'
              }}
            </span>
          </div>

          <!-- Variants -->
          <div v-if="product.hasVariants && product.variants?.length" class="flex flex-col gap-3">
            <span class="text-[10px] tracking-widest uppercase text-rose-300">Size</span>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="variant in product.variants"
                :key="variant.size"
                @click="selectVariant(variant)"
                :disabled="variant.stock === 0"
                :class="[
                  'px-4 py-2 text-xs tracking-widest uppercase border rounded-xl transition-all duration-200',
                  selectedVariant?.size === variant.size
                    ? 'border-rose-400 text-rose-700 bg-rose-100'
                    : 'border-rose-200 text-rose-400 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50',
                  variant.stock === 0 ? 'opacity-30 cursor-not-allowed line-through' : 'cursor-pointer'
                ]"
              >
                {{ variant.size }}
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="flex gap-2 flex-wrap">
            <Badge
              v-for="tag in product.tags"
              :key="tag"
              variant="outline"
              class="text-rose-200 border-rose-100 text-[9px] tracking-widest uppercase"
            >
              {{ tag }}
            </Badge>
          </div>

          <Separator class="bg-rose-200/60"/>

          <!-- Description -->
          <div v-if="product.description?.length"
               class="text-sm text-rose-700/60 leading-relaxed">
            <PortableText :value="product.description" :components="components"/>
          </div>

        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-rose-300 text-xs tracking-widest uppercase">
      ✕ Product not found
    </div>

  </AppLayout>
</template>
