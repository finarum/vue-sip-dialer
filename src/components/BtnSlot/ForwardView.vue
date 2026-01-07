<script setup>
import { useSipStore } from "../../composables/useSipStore";
import { sipBus } from "../../eventBus";

// Sample forwardable users - can be provided via props or store
const fowardableUsers = [
  { name: "Support Line 1", number: "9001" },
  { name: "Support Line 2", number: "9002" },
];

defineProps({
  show: { type: Boolean, default: false },
});

const { dispatch } = useSipStore();
</script>

<template>
  <template v-if="show">
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-n-slate-12 mb-4">
        {{ $t("sip.DIALPAD.CALL_FORWARD") }}
      </h3>
      <div class="space-y-2">
        <div
          v-for="user in fowardableUsers"
          :key="user.number"
          class="px-4 py-3 bg-n-solid-2 border border-n-weak rounded-lg cursor-pointer hover:bg-n-solid-active transition-colors"
          @click="
            () => {
              dispatch('sip/referCall', { target: user.number });
              sipBus.emit('sip:closeOverlay');
            }
          "
        >
          <div class="text-sm font-medium text-n-slate-12">
            {{ user.name }}
          </div>
          <div class="text-xs text-n-slate-11 mt-0.5">
            {{ user.number }}
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <!--  -->
  </template>
</template>
