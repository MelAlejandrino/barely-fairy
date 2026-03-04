<script setup lang="ts">
import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from '@sanity/types'
import { client } from '@/sanity/sanity.ts'
import type { PortableTextComponentProps } from '@portabletext/vue'

const builder = createImageUrlBuilder(client)

const props = defineProps<PortableTextComponentProps<Image & { alt?: string }>>()

const imageUrl = builder.image(props.value).width(800).url()
</script>

<template>
  <img :src="imageUrl" :alt="props.value.alt ?? ''" class="rounded-lg w-full max-w-lg my-4" />
</template>
