<script setup>
defineProps({
  show: { type: Boolean, default: false },
});

const emit = defineEmits(['advancedSettings']);
</script>

<template>
  <template v-if="show">
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-n-slate-12 mb-4">
        {{ $t('sip.DIALPAD.CALL_SETTINGS') }}
      </h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-n-slate-11">{{
            $t('sip.DIALPAD.AUTO_ANSWER')
          }}</span>
          <button
            class="px-4 py-1 bg-n-solid-3 text-n-slate-11 text-sm rounded-md"
          >
            {{ $t('sip.DIALPAD.OFF') }}
          </button>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-n-slate-11">{{
            $t('sip.DIALPAD.CALL_WAITING')
          }}</span>
          <button class="px-4 py-1 bg-n-blue-9 text-white text-sm rounded-md">
            {{ $t('sip.DIALPAD.ON') }}
          </button>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm text-n-slate-11">{{
            $t('sip.DIALPAD.SHOW_CALLER_ID')
          }}</span>
          <button class="px-4 py-1 bg-n-blue-9 text-white text-sm rounded-md">
            {{ $t('sip.DIALPAD.ON') }}
          </button>
        </div>
        <hr class="border-n-weak my-3" />
        <button
          class="w-full px-4 py-2 bg-n-solid-2 border border-n-weak rounded-lg text-sm text-n-slate-12 hover:bg-n-solid-3 transition-colors"
          @click="emit('advancedSettings')"
        >
          {{ $t('sip.DIALPAD.ADVANCED_SETTINGS') }}
        </button>
      </div>
    </div>
  </template>
  <template v-else>
    <!-- empty -->
  </template>
</template>
