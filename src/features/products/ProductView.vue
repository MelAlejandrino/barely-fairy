<script setup lang="ts">
import AppLayout from '@/layout/AppLayout.vue'
import ProductList from '@/features/products/ProductList.vue'
import {useSeo} from "@/composables/useSeo.ts";

useSeo({title: 'Products', description: 'Browse our handmade crochet products.'})
</script>

<template>
  <AppLayout>
    <ProductList paginate/>
  </AppLayout>
</template>
