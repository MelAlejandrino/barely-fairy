<script setup lang="ts">
import AppLayout from '@/layout/AppLayout.vue'
import {Button} from '@/components/ui/button'
import {useSeo} from '@/composables/useSeo'
import {Home, ArrowLeft} from 'lucide-vue-next'

useSeo({title: 'Page Not Found'})
</script>

<template>
  <AppLayout>
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">

      <!-- 404 -->
      <p class="text-8xl font-bold text-rose-200 mb-4 tracking-tight">404</p>

      <h1 class="text-2xl font-semibold text-rose-900 mb-3 tracking-wide">
        Page not found
      </h1>
      <p class="text-sm text-rose-400 mb-10 max-w-sm leading-relaxed">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted. 🌸
      </p>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          as-child
          class="text-rose-300 hover:text-rose-600 hover:bg-rose-100/50 gap-2 text-xs tracking-widest uppercase"
        >
          <RouterLink to="/">
            <Home class="w-3 h-3"/>
            Go Home
          </RouterLink>
        </Button>

        <Button
          variant="outline"
          as-child
          class="border-rose-200 text-rose-400 hover:bg-rose-100/50 hover:text-rose-600 gap-2 text-xs tracking-widest uppercase"
        >
          <RouterLink to="/products">
            <ArrowLeft class="w-3 h-3"/>
            View Products
          </RouterLink>
        </Button>
      </div>

    </div>
  </AppLayout>
</template>
