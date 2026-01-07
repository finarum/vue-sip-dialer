<script setup lang="ts">
import IndicatorConnected from './Indicator/IndicatorConnected.vue';
import IndicatorRegistered from './Indicator/IndicatorRegistered.vue';
import VerticalDivider from './VerticalDivider.vue';
import { useSipStore } from '../composables/useSipStore';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const { isConnected, isRegistered, isIncomingActive, isOutgoingActive, state } =
  useSipStore();
</script>

<template>
  <div class="flex items-center gap-3 absolute top-2 left-2">
    <IndicatorConnected :connected="isConnected" />
    <IndicatorRegistered v-if="isConnected" :registered="isRegistered" />
  </div>
  <div class="flex items-center gap-4 absolute top-2 right-4">
    <div v-if="isIncomingActive">
      <span
        class="info-phone-call i-lucide-phone-incoming"
        :class="{
          'animate-loader-pulse': state.callStatus !== 'active',
        }"
      />
    </div>
    <div v-if="isOutgoingActive">
      <span
        class="info-phone-call i-lucide-phone-outgoing"
        :class="{
          'animate-loader-pulse': state.callStatus !== 'active',
        }"
      />
    </div>
    <div v-if="state.callStatus === 'active'">
      <span class="info-phone-call i-lucide-voicemail" />
    </div>
  </div>
  <div class="absolute bottom-2 inset-x-0">
    <div class="text-center mt-2 text-xs text-n-slate-10">
      {{ t('sip.status') }}
      {{ isConnected ? t('sip.connected') : t('sip.disconnected') }}
      <VerticalDivider margin="0 0.5rem" />
      {{ t('sip.registered') }}
      {{ isRegistered ? t('sip.yes') : t('sip.no') }}
    </div>
  </div>
</template>

<style scoped>
.info-phone-call {
  @apply w-6 h-6 text-n-brand drop-shadow-[0_0_12px_rgba(99,102,241,0.8)] relative z-10;
}
</style>
