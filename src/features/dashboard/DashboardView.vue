<script setup lang="ts">
import AppLayout from '@/layout/AppLayout.vue'
import PostList from '../posts/PostList.vue'
import {Separator} from '@/components/ui/separator'
import {Badge} from '@/components/ui/badge'
import {Facebook, Instagram} from 'lucide-vue-next'
import {useSeo} from "@/composables/useSeo.ts";

useSeo()
</script>

<template>
  <AppLayout>

    <!-- Hero -->
    <div class="mb-12">
      <Badge variant="outline"
             class="text-rose-300 border-rose-200 text-[9px] tracking-widest uppercase mb-4">
        Handmade with love 🌸
      </Badge>
      <h1 class="text-4xl font-semibold text-rose-900 tracking-wide leading-tight mb-4">
        Barely Fairy
      </h1>
      <p class="text-sm text-rose-400 leading-relaxed max-w-md">
        Hi! I'm Mary, a crochet artist based in the Philippines. I make handmade crochet pieces
        — from bags to accessories — all crafted with care and love. 🧶
      </p>

      <!-- Socials -->
      <div class="flex items-center gap-3 mt-6">
        <a href="https://facebook.com/yourpage" target="_blank"
           class="flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 text-rose-400 hover:text-rose-600 hover:bg-rose-100/50 transition-all duration-200 text-xs tracking-wide">
          <Facebook class="w-3.5 h-3.5"/>
          Facebook
        </a>
        <a href="https://instagram.com/yourhandle" target="_blank"
           class="flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 text-rose-400 hover:text-rose-600 hover:bg-rose-100/50 transition-all duration-200 text-xs tracking-wide">
          <Instagram class="w-3.5 h-3.5"/>
          Instagram
        </a>
      </div>
    </div>

    <Separator class="bg-rose-200/60 mb-12"/>

    <PostList :limit="3" label="Latest"/>

  </AppLayout>
</template>
