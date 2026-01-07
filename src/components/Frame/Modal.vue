<script setup>
import { ref, defineProps, computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
});

const store = useStore();
const isIncomingCall = computed(() => store.state.sip.isIncoming);
const isOpen = ref(false);
const modalPosition = ref({
  x: window.innerWidth / 15 || 15,
  y: window.innerHeight / 15 || 15,
});
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

const open = () => {
  isOpen.value = true;
};
const close = () => {
  isOpen.value = false;
};
const toggle = () => {
  isOpen.value = !isOpen.value;
};

const startDrag = event => {
  isDragging.value = true;
  dragOffset.value = {
    x: event.clientX - modalPosition.value.x,
    y: event.clientY - modalPosition.value.y,
  };
};

const onDrag = event => {
  if (!isDragging.value) return;
  modalPosition.value = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y,
  };
};

const endDrag = () => {
  isDragging.value = false;
};

defineExpose({
  toggle,
  open,
  close,
  isOpen,
});
</script>

<template>
  <div :class="{ [props.class]: true }" @click="open">
    <slot name="trigger" />
  </div>
  <div
    v-if="isOpen || isIncomingCall"
    class="fixed z-50"
    :style="{ top: modalPosition.y + 'px', left: modalPosition.x + 'px' }"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
  >
    <div
      class="max-w-md relative cursor-move border-n-weak group after:content-[''] after:absolute after:-inset-12 after:z-[-1]"
      @mousedown="startDrag"
      @click.stop
    >
      <button
        class="absolute top-0 right-0 text-n-slate-11 translate-x-3/4 -translate-y-3/4 hover:!opacity-[.7] hover:!scale-[1.1] transition-all opacity-[.1] group-hover:opacity-[.3]"
        @click="close"
      >
        <span
          class="i-lucide-circle-x w-8 h-8 hover:text-n-ruby-9 transition-all"
        />
      </button>

      <slot />
    </div>
  </div>
</template>
