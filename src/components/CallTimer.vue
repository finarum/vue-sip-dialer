<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSipStore } from "../composables/useSipStore";

defineProps<{
  currentCallNumber?: string;
  formattedTime?: string;
}>();

const { t } = useI18n();
const { callStatusText } = useSipStore();
</script>

<template>
  <div class="mb-6">
    <div class="text-sm text-n-slate-10 uppercase tracking-wide mb-2">
      {{ t(`sip.${callStatusText}`) }}
    </div>
    <div class="text-2xl font-semibold text-n-slate-12 mb-1">
      {{ currentCallNumber }}
    </div>
    <div class="text-sm text-n-slate-10">
      {{ formattedTime }}
    </div>
  </div>
</template>
