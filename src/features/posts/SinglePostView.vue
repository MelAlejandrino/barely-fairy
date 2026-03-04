<script setup lang="ts">
import { useRoute } from "vue-router"
import { PortableText } from "@portabletext/vue"
import { format } from "date-fns"
import AppLayout from "@/layout/AppLayout.vue"
import SanityImage from "@/components/SanityImage.vue"
import { usePost } from "@/composables/usePost.ts"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-vue-next"
import { createImageUrlBuilder } from "@sanity/image-url"
import { client } from "@/sanity/sanity.ts"
import type { Image } from "@sanity/types"
import type { Product } from "@/types/product.ts"
import { computed } from "vue"
import { useHead } from "@unhead/vue"

const builder = createImageUrlBuilder(client)

function imageUrl(image: Image | undefined, width = 200) {
  if (!image) return ""
  return builder.image(image).width(width).fit("crop").url()
}

const route = useRoute()
const slug = route.params.slug as string
const { post, loading, error } = usePost(slug)

const components = { types: { image: SanityImage } }

const linkedProducts = computed(() =>
  (post.value?.linkedProducts ?? []).filter((p): p is Product => "_id" in p),
)

function formatLinkedProductPrice(product: Product) {
  if (product.hasVariants && product.variants?.length) {
    const prices = product.variants.map((v) => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? `₱${min}` : `₱${min} – ₱${max}`
  }
  return product.price ? `₱${product.price}` : "—"
}

useHead({
  title: computed(() =>
    post.value?.seo?.metaTitle
      ? `${post.value.seo.metaTitle} — Barely Fairy`
      : post.value?.title
        ? `${post.value.title} — Barely Fairy`
        : "Barely Fairy",
  ),
  meta: [
    { name: "description", content: computed(() => post.value?.seo?.metaDescription ?? "") },
    {
      property: "og:title",
      content: computed(() => post.value?.seo?.metaTitle ?? post.value?.title ?? ""),
    },
    {
      property: "og:description",
      content: computed(() => post.value?.seo?.metaDescription ?? ""),
    },
    {
      property: "og:image",
      content: computed(() =>
        post.value?.seo?.ogImage
          ? builder.image(post.value.seo.ogImage).width(1200).height(630).url()
          : "https://barely-fairy.vercel.app/og-default.jpg",
      ),
    },
    { property: "og:type", content: "product" },
  ],
})
</script>

<template>
  <AppLayout>
    <!-- Loading -->
    <div v-if="loading" class="max-w-2xl flex flex-col gap-4">
      <Skeleton class="h-4 w-20 bg-rose-100" />
      <Skeleton class="h-10 w-3/4 bg-rose-100 mt-4" />
      <Skeleton class="h-4 w-1/4 bg-rose-100" />
      <Skeleton class="h-px w-full bg-rose-100 my-4" />
      <Skeleton class="h-4 w-full bg-rose-100" />
      <Skeleton class="h-4 w-5/6 bg-rose-100" />
      <Skeleton class="h-4 w-4/6 bg-rose-100" />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="text-red-400 text-xs tracking-widest uppercase border border-red-200 rounded-lg px-6 py-4"
    >
      ✕ Failed to load post
    </div>

    <!-- Post -->
    <article v-else-if="post" class="max-w-2xl">
      <!-- Back -->
      <Button
        variant="ghost"
        as-child
        class="text-rose-300 hover:text-rose-600 hover:bg-rose-100/50 mb-10 -ml-3 gap-2 text-xs tracking-widest uppercase"
      >
        <RouterLink to="/posts">
          <ArrowLeft class="w-3 h-3" />
          Back to Posts
        </RouterLink>
      </Button>

      <!-- Header -->
      <div class="mb-8">
        <Badge
          variant="outline"
          class="text-rose-300 border-rose-200 text-[9px] tracking-widest uppercase mb-4"
        >
          {{ format(post.publishedAt, "MMMM dd, yyyy") }}
        </Badge>
        <h1 class="text-4xl font-semibold text-rose-900 leading-tight tracking-wide">
          {{ post.title }}
        </h1>
      </div>

      <Separator class="bg-rose-200/60 mb-10" />

      <!-- Body -->
      <div
        class="text-rose-800/70 text-sm leading-8 tracking-wide [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-rose-900 [&_h1]:mb-4 [&_h1]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-rose-900 [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-rose-900 [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-5 [&_strong]:text-rose-900 [&_strong]:font-semibold [&_em]:text-rose-600 [&_em]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:text-rose-700 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:text-rose-700 [&_li]:mb-1 [&_a]:text-rose-500 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-rose-700 [&_blockquote]:border-l-2 [&_blockquote]:border-rose-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-rose-400"
      >
        <PortableText :value="post.body ?? []" :components="components" />
      </div>

      <!-- Linked Products -->
      <div v-if="linkedProducts?.length" class="mt-12">
        <Separator class="bg-rose-200/60 mb-8" />

        <h2 class="text-xs tracking-widest uppercase text-rose-300 mb-6">Featured in this post</h2>

        <div class="flex flex-col gap-3">
          <RouterLink
            v-for="product in linkedProducts"
            :key="product._id"
            :to="`/products/${product.slug.current}`"
            class="group flex items-center gap-4 p-4 rounded-2xl border border-rose-200/60 hover:bg-rose-100/30 hover:border-rose-300/60 transition-all duration-300"
          >
            <!-- Image -->
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-rose-100 shrink-0">
              <img
                v-if="product.featured_image"
                :src="imageUrl(product.featured_image)"
                :alt="product.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-rose-300 text-xs"
              >
                —
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-rose-800 group-hover:text-rose-900 transition-colors truncate"
              >
                {{ product.title }}
              </p>
              <Badge
                variant="outline"
                :class="
                  product.inStock
                    ? 'text-emerald-500 border-emerald-200 text-[9px] tracking-widest uppercase mt-1'
                    : 'text-red-400 border-red-200 text-[9px] tracking-widest uppercase mt-1'
                "
              >
                {{ product.inStock ? "In Stock" : "Out of Stock" }}
              </Badge>
            </div>

            <!-- Price + arrow -->
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-sm font-mono text-rose-700">
                {{ formatLinkedProductPrice(product) }}
              </span>
              <span
                class="text-rose-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all duration-300"
              >
                →
              </span>
            </div>
          </RouterLink>
        </div>
      </div>

      <Separator class="bg-rose-200/60 mt-12 mb-8" />

      <!-- Footer -->
      <div class="flex items-center justify-between">
        <Button
          variant="ghost"
          as-child
          class="text-rose-300 hover:text-rose-600 hover:bg-rose-100/50 -ml-3 gap-2 text-xs tracking-widest uppercase"
        >
          <RouterLink to="/posts">
            <ArrowLeft class="w-3 h-3" />
            Back to Posts
          </RouterLink>
        </Button>

        <span class="text-[10px] tracking-widest uppercase text-rose-300"> Barely Fairy 🌸 </span>
      </div>
    </article>

    <!-- Not found -->
    <div v-else class="text-rose-300 text-xs tracking-widest uppercase">✕ Post not found</div>
  </AppLayout>
</template>
