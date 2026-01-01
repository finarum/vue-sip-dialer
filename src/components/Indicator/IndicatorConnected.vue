<script setup>
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  connected: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
</script>

<template>
  <span
    v-if="props.connected"
    class="i-lucide-signal w-5 h-5 text-n-teal-9 opacity-70"
  />
  <span v-else class="flex items-center gap-1 text-n-ruby-9">
    <span class="i-lucide-signal w-5 h-5 text-n-ruby-9 opacity-70" />{{
      t('indicator.unknown')
    }}
  </span>
</template>
