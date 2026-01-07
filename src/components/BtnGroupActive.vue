<script setup>
import { sipBus } from "../eventBus";

const icons = [
  "i-lucide-pause",
  "i-lucide-forward",
  "i-lucide-keyboard",
  "i-lucide-circle-dot",
  "i-lucide-users",
  "i-lucide-menu",
  "i-lucide-mic",
  "i-lucide-settings",
];

const handleClick = (icon) => {
  switch (icon) {
    case "i-lucide-pause":
      sipBus.emit("sip:pause");
      break;
    case "i-lucide-forward":
      sipBus.emit("sip:forward");
      break;
    case "i-lucide-keyboard":
      sipBus.emit("sip:keyboard");
      break;
    case "i-lucide-circle-dot":
      sipBus.emit("sip:circle");
      break;
    case "i-lucide-users":
      sipBus.emit("sip:users");
      break;
    case "i-lucide-menu":
      sipBus.emit("sip:menu");
      break;
    case "i-lucide-mic":
      sipBus.emit("sip:mic");
      break;
    case "i-lucide-settings":
      sipBus.emit("sip:settings");
      break;
    default:
      break;
  }
};
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-5 p-2.5">
    <button
      v-for="icon in icons"
      :key="icon"
      class="w-[64px] h-[64px] rounded-full bg-n-solid-2 border border-n-weak flex items-center justify-center cursor-pointer transition-all active:scale-[0.91] disabled:opacity-40 disabled:cursor-default disabled:scale-[1] hover:bg-n-solid-3"
      @click="handleClick(icon)"
    >
      <span
        class="w-7 h-7"
        :class="{
          [icon]: true,
          'text-n-ruby-9': icon === 'i-lucide-circle-dot',
        }"
      />
    </button>
  </div>
</template>
: string
