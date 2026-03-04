<template>
  <div class="min-h-screen bg-rose-50" style="font-family: 'Nunito', sans-serif;">
    <!-- Desktop top nav -->
    <header
      class="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-rose-50/95 backdrop-blur-sm border-b border-rose-200/60">
      <div class="max-w-6xl mx-auto px-12 py-4 flex items-center justify-between">

        <!-- Brand -->
        <div class="flex items-baseline gap-2">
          <span class="text-[9px] tracking-[0.4em] uppercase text-rose-300">Barely</span>
          <span class="text-lg font-semibold tracking-wide text-rose-900">Fairy</span>
        </div>

        <!-- Nav -->
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem v-for="link in links" :key="link.to">
              <NavigationMenuLink as-child>
                <RouterLink :to="link.to"
                            class="text-xs tracking-[0.2em] uppercase text-rose-400 hover:text-rose-800 transition-colors px-4 py-2 block">
                  {{ link.label }}
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <!-- Date -->
        <span class="text-[10px] tracking-[0.2em] uppercase text-rose-300">
          {{
            new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })
          }}
        </span>
      </div>
    </header>

    <!-- Mobile top bar (no hamburger) -->
    <header
      class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-rose-50/95 backdrop-blur-sm border-b border-rose-200/60 px-6 py-4 flex items-center justify-center">
      <div class="flex items-baseline gap-2">
        <span class="text-[9px] tracking-[0.4em] uppercase text-rose-300">Barely</span>
        <span class="text-lg font-semibold text-rose-900">Fairy</span>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-6xl mx-auto px-6 lg:px-12 pt-24 pb-28 lg:pb-20">
      <slot/>
    </main>

    <!-- Desktop footer -->
    <footer class="hidden lg:block border-t border-rose-200/60 py-8">
      <div class="max-w-6xl mx-auto px-12 flex items-center justify-between">
        <span class="text-[10px] tracking-[0.3em] uppercase text-rose-300">
          Barely Fairy © {{ new Date().getFullYear() }}
        </span>
        <span class="text-[10px] tracking-[0.3em] uppercase text-rose-300">
          Handmade with love 🌸
        </span>
      </div>
    </footer>

    <!-- Mobile bottom tab bar -->
    <nav
      class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-rose-200/60 px-2 py-2 flex items-center justify-around">
      <NavLink
        v-for="link in links"
        :key="link.to"
        :link="link"
      />
    </nav>

  </div>
</template>

<script setup lang="ts">
import {RouterLink} from 'vue-router'
import {Home, BookOpen, ShoppingBag} from 'lucide-vue-next'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import NavLink from "@/components/NavLink.vue";

const links = [
  {to: '/', label: 'Home', icon: Home},
  {to: '/posts', label: 'Posts', icon: BookOpen},
  {to: '/products', label: 'Products', icon: ShoppingBag},
]
</script>
