<script setup lang="ts">
import AppLayout from '@/layout/AppLayout.vue'
import ProductList from '@/features/products/ProductList.vue'
import {useSeo} from "@/composables/useSeo.ts";
import {ref} from "vue";

useSeo({title: 'Products', description: 'Browse our handmade crochet products.'})
const search = ref('')
</script>

<template>
  <AppLayout>
    <ProductList paginate :search="search"/>
  </AppLayout>
</template>
