<script setup>
const icons = [
  'i-lucide-pause',
  'i-lucide-forward',
  'i-lucide-keyboard',
  'i-lucide-circle-dot',
  'i-lucide-users',
  'i-lucide-menu',
  'i-lucide-mic',
  'i-lucide-settings',
];
const forward = () => {};
const keyboard = () => {};
const circle = () => {};
const users = () => {};
const menu = () => {};
const mic = () => {};
const settings = () => {};
const sip_pause = () => {};

const handleClick = icon => {
  switch (icon) {
    case 'i-lucide-pause':
      sip_pause();
      break;
    case 'i-lucide-forward':
      forward();
      break;
    case 'i-lucide-keyboard':
      keyboard();
      break;
    case 'i-lucide-circle-dot':
      circle();
      break;
    case 'i-lucide-users':
      users();
      break;
    case 'i-lucide-menu':
      menu();
      break;
    case 'i-lucide-mic':
      mic();
      break;
    case 'i-lucide-settings':
      settings();
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
      class="w-[50px] h-[50px] rounded-full bg-n-solid-2 border border-n-weak flex items-center justify-center cursor-pointer transition-all active:scale-[0.91] disabled:opacity-40 disabled:cursor-default disabled:scale-[1]"
      @click="handleClick(icon)"
    >
      <span
        class="w-6 h-6"
        :class="{
          [icon]: true,
          'text-n-ruby-9': icon === 'i-lucide-circle-dot',
        }"
      />
    </button>
  </div>
</template>
: string
