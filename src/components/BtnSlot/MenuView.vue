<script setup>
defineProps({
  show: { type: Boolean, default: false },
});
const emit = defineEmits(['holdCall', 'transfer', 'addToContacts']);
</script>

<template>
  <template v-if="show">
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-n-slate-12 mb-4">
        {{ $t('sip.DIALPAD.CALL_OPTIONS') }}
      </h3>
      <div class="space-y-2">
        <button
          class="w-full px-4 py-3 bg-n-solid-2 border border-n-weak rounded-lg text-left hover:bg-n-solid-3 transition-colors"
          @click="emit('holdCall')"
        >
          <div class="text-sm font-medium text-n-slate-12">
            {{ $t('sip.DIALPAD.HOLD_CALL') }}
          </div>
          <div class="text-xs text-n-slate-11">
            {{ $t('sip.DIALPAD.PUT_CALL_ON_HOLD') }}
          </div>
        </button>
        <button
          class="w-full px-4 py-3 bg-n-solid-2 border border-n-weak rounded-lg text-left hover:bg-n-solid-3 transition-colors"
          @click="emit('transfer')"
        >
          <div class="text-sm font-medium text-n-slate-12">
            {{ $t('sip.DIALPAD.TRANSFER') }}
          </div>
          <div class="text-xs text-n-slate-11">
            {{ $t('sip.DIALPAD.TRANSFER_TO_ANOTHER_NUMBER') }}
          </div>
        </button>
        <button
          class="w-full px-4 py-3 bg-n-solid-2 border border-n-weak rounded-lg text-left hover:bg-n-solid-3 transition-colors"
          @click="emit('addToContacts')"
        >
          <div class="text-sm font-medium text-n-slate-12">
            {{ $t('sip.DIALPAD.ADD_TO_CONTACTS') }}
          </div>
          <div class="text-xs text-n-slate-11">
            {{ $t('sip.DIALPAD.SAVE_THIS_NUMBER') }}
          </div>
        </button>
      </div>
    </div>
  </template>
  <template v-else>
    <!-- empty -->
  </template>
</template>
