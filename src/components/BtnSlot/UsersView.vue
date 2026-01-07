<script setup>
defineProps({
  show: { type: Boolean, default: false },
  contacts: { type: Array, default: () => [] },
});

const emit = defineEmits(['selectContact']);
</script>

<template>
  <template v-if="show">
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-n-slate-12 mb-4">
        {{ $t('sip.DIALPAD.CONFERENCE') }}
      </h3>
      <p class="text-sm text-n-slate-11 mb-4">
        {{ $t('sip.DIALPAD.ADD_PARTICIPANTS') }}
      </p>
      <div class="space-y-2">
        <div
          v-for="contact in contacts"
          :key="contact.number"
          class="px-3 py-2 bg-n-solid-2 border border-n-weak rounded-lg hover:bg-n-solid-3 cursor-pointer transition-colors"
          @click="emit('selectContact', contact.number)"
        >
          <div class="text-sm font-medium text-n-slate-12">
            {{ contact.name }}
          </div>
          <div class="text-xs text-n-slate-11">
            {{ contact.number }}
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <!-- empty -->
  </template>
</template>
