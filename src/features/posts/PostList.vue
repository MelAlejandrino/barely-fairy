<script setup lang="ts">
import {computed} from 'vue'
import {PortableText} from '@portabletext/vue'
import {usePosts} from '@/composables/usePosts'
import {format} from 'date-fns'
import SanityImage from '@/components/SanityImage.vue'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {Skeleton} from '@/components/ui/skeleton'

const props = withDefaults(
  defineProps<{
    limit?: number
    label?: string
    paginate?: boolean
  }>(),
  {
    limit: undefined,
    label: 'Posts',
    paginate: false,
  },
)

const {posts, loading, error, currentPage, totalPages, goToPage} = usePosts()
const components = {types: {image: SanityImage}}

const displayedPosts = computed(() =>
  props.limit ? posts.value.slice(0, props.limit) : posts.value,
)
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="flex flex-col gap-4">
    <Skeleton v-for="n in 5" :key="n" class="h-24 w-full bg-rose-100/60 rounded-xl"/>
  </div>

  <!-- Error -->
  <div v-else-if="error"
       class="text-red-400 text-xs tracking-widest uppercase border border-red-200 rounded-lg px-6 py-4">
    ✕ Failed to load posts
  </div>

  <!-- Posts -->
  <div v-else class="flex flex-col">

    <!-- Header -->
    <div class="flex items-baseline justify-between mb-6">
      <h1 class="text-2xl font-semibold tracking-wide text-rose-900">{{ label }}</h1>
      <Badge variant="outline"
             class="text-rose-300 border-rose-200 text-[10px] tracking-widest uppercase">
        {{ displayedPosts.length }} entries
      </Badge>
    </div>

    <Separator class="bg-rose-200/60 mb-2"/>

    <!-- Post rows -->
    <RouterLink
      v-for="(post, i) in displayedPosts"
      :key="post._id"
      :to="`/posts/${post.slug.current}`"
      class="group flex items-center gap-6 py-6 border-b border-rose-200/60 hover:bg-rose-100/30 transition-colors duration-300 -mx-4 px-4"
    >
      <!-- Index -->
      <span class="text-[10px] text-rose-300 font-mono shrink-0 w-5 text-right">
        {{ String((currentPage - 1) * 5 + i + 1).padStart(2, '0') }}
      </span>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h2
          class="text-base font-medium text-rose-800 group-hover:text-rose-900 transition-colors leading-snug truncate mb-1">
          {{ post.title }}
        </h2>
        <div class="text-xs text-rose-400 leading-relaxed line-clamp-1">
          <PortableText :value="post.body ?? []" :components="components"/>
        </div>
      </div>

      <!-- Date + arrow -->
      <div class="flex items-center gap-3 shrink-0">
        <Badge variant="outline"
               class="text-rose-300 border-rose-200 text-[9px] tracking-widest uppercase hidden sm:flex">
          {{ format(post.publishedAt, 'MMM dd, yyyy') }}
        </Badge>
        <span
          class="text-rose-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all duration-300 text-sm">
          →
        </span>
      </div>
    </RouterLink>

    <Separator class="bg-rose-200/60"/>

    <!-- Pagination -->
    <div v-if="paginate && totalPages > 1"
         class="flex items-center justify-center gap-1 py-12">
      <Button
        variant="ghost"
        size="icon"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        class="text-rose-300 hover:text-rose-700 hover:bg-rose-100 disabled:opacity-20"
      >
        ←
      </Button>

      <Button
        v-for="page in totalPages"
        :key="page"
        variant="ghost"
        size="icon"
        @click="goToPage(page)"
        :class="[
          'text-xs w-8 h-8 transition-all duration-200',
          currentPage === page
            ? 'text-rose-700 bg-rose-100 border-b-2 border-rose-400'
            : 'text-rose-300 hover:text-rose-700 hover:bg-rose-100'
        ]"
      >
        {{ page }}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        class="text-rose-300 hover:text-rose-700 hover:bg-rose-100 disabled:opacity-20"
      >
        →
      </Button>
    </div>
  </div>
</template>
