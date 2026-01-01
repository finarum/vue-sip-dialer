<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'call', 'video']);

const inputRef = ref(null);
const value = ref('+998996138990');

watch(
  () => props.modelValue,
  v => {
    value.value = v;
  }
);
watch(value, v => emit('update:modelValue', v));

const activeKey = ref(null);

function pressDown(label) {
  activeKey.value = label; // adds press animation
}

function pressUp() {
  activeKey.value = null;
}

function press(label) {
  value.value += label;
}

function backspace() {
  value.value = value.value?.slice(0, -1);
  if (!value.value) {
    inputRef?.value?.focus();
  }
}

const keys = [
  { label: '1', sub: '' },
  { label: '2', sub: 'ABC' },
  { label: '3', sub: 'DEF' },
  { label: '4', sub: 'GHI' },
  { label: '5', sub: 'JKL' },
  { label: '6', sub: 'MNO' },
  { label: '7', sub: 'PQRS' },
  { label: '8', sub: 'TUV' },
  { label: '9', sub: 'WXYZ' },
  { label: '*', sub: '' },
  { label: '0', sub: '' },
  { label: '#', sub: '' },
];
onMounted(() => {
  inputRef.value.focus();
});
</script>

<template>
  <div class="w-[280px] mx-auto font-sans">
    <div class="flex items-center justify-center mb-4 w-full">
      <div class="relative w-full">
        <input
          ref="inputRef"
          v-model="value"
          class="w-full text-3xl text-n-slate-12 bg-n-background focus:outline-none select-none px-1 py-2 pe-5 border-b-2 text-center"
          :class="!value ? 'border-n-slate-11' : 'border-n-slate-10'"
          type="text"
          @input="value = value.replace(/[^0-98#*+]/g, '')"
        />
        <button
          class="absolute top-0 right-0 -translate-y-2 h-full flex items-center justify-center text-n-slate-11 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-default disabled:scale-none active:scale-[.96] disabled:hidden"
          :disabled="!value"
          @click="backspace"
        >
          <span class="i-lucide-delete w-6 h-6" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-[18px] p-2.5">
      <div
        v-for="key in keys"
        :key="key.label"
        class="select-none w-[70px] h-[70px] rounded-full bg-n-solid-2 border border-n-weak flex flex-col items-center justify-center cursor-pointer transition-all duration-100 ease-in-out"
        :class="{
          'scale-[0.88] bg-n-solid-active': activeKey === key.label,
        }"
        @mousedown="pressDown(key.label)"
        @mouseup="pressUp"
        @mouseleave="pressUp"
        @click="press(key.label)"
      >
        <span class="text-2xl font-medium text-n-slate-12">{{
          key.label
        }}</span>
        <span v-if="key.sub" class="text-[10px] text-n-slate-11 mt-[2px]">{{
          key.sub
        }}</span>
      </div>
    </div>

    <div class="flex justify-center gap-[25px] mt-4">
      <button
        class="w-[60px] h-[60px] rounded-full bg-n-brand text-white flex items-center justify-center text-2xl border-none cursor-pointer transition-all active:scale-[0.91] disabled:opacity-40 disabled:cursor-default disabled:scale-[1]"
        :disabled="!value"
        @click="$emit('call', value)"
      >
        <span class="i-lucide-phone w-8 h-8" />
      </button>
      <button
        class="w-[60px] h-[60px] rounded-full bg-n-brand text-white flex items-center justify-center text-2xl border-none cursor-pointer transition-all active:scale-[.91] disabled:opacity-40 disabled:cursor-default disabled:scale-[1]"
        :disabled="!value"
        @click="$emit('video', value)"
      >
        <span class="i-lucide-video w-8 h-8" />
      </button>
    </div>
  </div>
</template>
