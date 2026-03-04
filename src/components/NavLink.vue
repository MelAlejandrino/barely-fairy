<script setup lang="ts">
import {RouterLink, useLink} from 'vue-router'
import type {Component} from 'vue'

const props = defineProps<{
  link: { to: string; label: string; icon: Component }
}>()

const {isActive} = useLink({to: props.link.to})
</script>

<template>
  <RouterLink
    :to="link.to"
    class="flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-200"
    :class="isActive ? 'bg-rose-100' : ''"
  >
    <component :is="link.icon" class="w-5 h-5 transition-colors"
               :class="isActive ? 'text-rose-500' : 'text-rose-300'"/>
    <span class="text-[9px] tracking-widest uppercase transition-colors"
          :class="isActive ? 'text-rose-600' : 'text-rose-300'">
      {{ link.label }}
    </span>
  </RouterLink>
</template>
