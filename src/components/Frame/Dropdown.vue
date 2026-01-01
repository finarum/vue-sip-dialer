<script setup>
import { ref } from 'vue';

const opened = ref(false);
setTimeout(() => {
  opened.value = true;
}, 1000);
</script>

<template>
  <button
    v-if="!opened"
    class="btn flex items-center justify-center group"
    @click="opened = !opened"
  >
    <span
      class="i-lucide-chevron-down w-9 h-9 group-hover:translate-y-[2px] transition-all duration-[0.3s] opacity-50 group-hover:opacity-80"
    />
  </button>

  <Transition name="expand">
    <div v-if="opened" class="expand-wrapper">
      <slot name="default" />
    </div>
  </Transition>

  <button
    v-if="opened"
    class="btn flex items-center justify-center group"
    @click="opened = !opened"
  >
    <span
      class="i-lucide-chevron-up w-9 h-9 group-hover:-translate-y-[2px] transition-all duration-[0.3s] opacity-50 group-hover:opacity-80"
    />
  </button>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease-out;
  transition: max-height 0.5s ease-out;
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
