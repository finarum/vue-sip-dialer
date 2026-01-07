<script setup lang="ts">
import { useSipStore } from '../composables/useSipStore';
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});

const { isConnected, isRegistered } = useSipStore();
</script>

<template>
  <div
    v-show="props.show"
    class="fixed bottom-5 right-10 cursor-pointer group opacity-70"
  >
    <div class="relative">
      <!-- Smartphone SVG -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="200"
        viewBox="0 0 100 200"
      >
        <!-- Phone body -->
        <rect
          x="5"
          y="5"
          width="90"
          height="190"
          rx="15"
          ry="15"
          fill="#333333"
        />
        <!-- Phone screen -->
        <rect
          x="10"
          y="20"
          width="80"
          height="150"
          rx="5"
          ry="5"
          fill="#000000"
        />
        <!-- Speaker notch -->
        <rect
          x="35"
          y="10"
          width="30"
          height="4"
          rx="2"
          ry="2"
          fill="#555555"
        />
        <!-- Camera -->
        <circle cx="25" cy="12" r="2" fill="#555555" />
        <!-- Home button -->
        <circle cx="50" cy="185" r="8" fill="#555555" />

        <!-- Registered state: success green -->
        <!-- WiFi icon -->
        <g>
          <foreignObject
            v-if="isConnected"
            x="15"
            y="20"
            width="20"
            height="20"
          >
            <div class="flex items-center justify-center w-full h-full">
              <span class="i-lucide-wifi w-6 h-6 text-n-teal-9" />
            </div>
          </foreignObject>

          <foreignObject v-else x="15" y="20" width="20" height="20">
            <div class="flex items-center justify-center w-full h-full">
              <span class="i-lucide-wifi-off w-6 h-6 text-n-ruby-9" />
            </div>
          </foreignObject>
        </g>

        <g>
          <!-- User check icon -->
          <foreignObject
            v-if="isRegistered"
            x="40"
            y="20"
            width="20"
            height="20"
          >
            <div class="flex items-center justify-center w-full h-full">
              <span class="i-lucide-user-check w-6 h-6 text-n-teal-9" />
            </div>
          </foreignObject>
          <foreignObject v-else x="40" y="20" width="20" height="20">
            <div class="flex items-center justify-center w-full h-full">
              <span class="i-lucide-user-round-x w-6 h-6 text-n-ruby-9" />
            </div>
          </foreignObject>
        </g>
      </svg>

      <!-- Call icon overlay -->
      <div class="absolute inset-0 flex items-center justify-center">
        <span
          v-if="isConnected && isRegistered"
          class="i-lucide-phone-outgoing w-14 h-14 opacity-30 group-hover:opacity-70 transition-opacity text-sky-500"
        />
        <span
          v-else
          class="i-lucide-phone-off w-14 h-14 opacity-30 transition-opacity text-n-ruby-500"
        />
      </div>
    </div>
  </div>
</template>
