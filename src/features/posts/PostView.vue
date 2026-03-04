<script setup lang="ts">
import AppLayout from '@/layout/AppLayout.vue'
import PostList from '../posts/PostList.vue'
import {useSeo} from "@/composables/useSeo.ts";

useSeo({title: 'Posts', description: 'Read our latest crochet posts and updates.'})
</script>

<template>
  <AppLayout>
    <PostList paginate/>
  </AppLayout>
</template>
