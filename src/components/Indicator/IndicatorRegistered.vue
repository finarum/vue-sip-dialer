<script setup lang="ts">
const props = defineProps({
  registered: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <span
    v-if="props.registered"
    class="i-lucide-user-check w-5 h-5 text-n-teal-9 opacity-70"
  />
  <span v-else class="i-lucide-user-x w-5 h-5 text-n-ruby-9 opacity-70" />
</template>
