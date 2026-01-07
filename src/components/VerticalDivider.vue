<script setup>
import { computed } from 'vue';

const props = defineProps({
  height: {
    type: String,
    default: '1em',
  },
  width: {
    type: String,
    default: '1px',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  opacity: {
    type: [String, Number],
    default: 0.3,
  },
  margin: {
    type: String,
    default: '0 0.5em',
  },
});

const dividerStyle = computed(() => ({
  height: props.height,
  width: props.width,
  backgroundColor: props.color,
  opacity: props.opacity,
  margin: props.margin,
}));
</script>

<template>
  <span class="vertical-divider" :style="dividerStyle" aria-hidden="true" />
</template>

<style scoped>
.vertical-divider {
  display: inline-block;
  vertical-align: middle;
}
</style>
