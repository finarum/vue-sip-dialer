<script setup>
import {
  ref,
  watch,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
} from "vue";
import BtnGroupActive from "./BtnGroupActive.vue";
import IncomingCallOverlay from "./IncomingCallOverlay.vue";
import ForwardView from "./BtnSlot/ForwardView.vue";
import UsersView from "./BtnSlot/UsersView.vue";
import MenuView from "./BtnSlot/MenuView.vue";
import SettingsView from "./BtnSlot/SettingsView.vue";
import { sipBus } from "../eventBus";

const props = defineProps({
  modelValue: { type: String, default: "" },
  hasActiveSession: { type: Boolean, default: false },
  isIncomingActive: { type: Boolean, default: false },
  remoteIdentity: { type: String, default: "" },
});

const emit = defineEmits([
  "update:modelValue",
  "call",
  "hangup",
  "sipPause",
  "sipKeyboard",
  "sipCircle",
  "sipMic",
  "sipSettings",
]);

const inputRef = ref(null);
const value = ref("");
const activeTab = ref("dialpad");
const showOptionsOverlay = ref(false);
const currentView = ref(""); // Mini router: 'forward', 'keyboard', 'circle', 'users', 'menu', 'mic', 'settings'

function hideOptionsOverlay() {
  showOptionsOverlay.value = false;
  currentView.value = "";
}

const applyDial = (number) => {
  value.value = number;
  inputRef.value.focus();
  showOptionsOverlay.value = false;
};

function showView(view) {
  currentView.value = view;
  showOptionsOverlay.value = true;
}

const tabs = [
  { id: "dialpad", label: "Dialpad", icon: "i-lucide-grid-3x3" },
  { id: "functions", label: "Functions", icon: "i-lucide-settings" },
  { id: "history", label: "History", icon: "i-lucide-history" },
];

// Sample phone numbers - can be replaced with data from props/store/API
const phoneNumbers = ref([
  { name: "John Doe", number: "+998901234567" },
  { name: "Anvar Buranov", number: "+998996138990" },
]);

watch(
  () => props.modelValue,
  (v) => {
    value.value = v;
  }
);
watch(value, (v) => emit("update:modelValue", v));

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

onMounted(() => {
  inputRef.value.focus();
  sipBus.on("sip:pause", () => emit("sipPause"));
  sipBus.on("sip:forward", () => showView("forward"));
  sipBus.on("sip:keyboard", () => emit("sipKeyboard"));
  sipBus.on("sip:circle", () => emit("sipCircle"));
  sipBus.on("sip:users", () => showView("users"));
  sipBus.on("sip:menu", () => showView("menu"));
  sipBus.on("sip:mic", () => emit("sipMic"));
  sipBus.on("sip:settings", () => showView("settings"));
  sipBus.on("sip:closeOverlay", () => {
    setTimeout(hideOptionsOverlay, 1);
  });
});

onUnmounted(() => {
  sipBus.all.clear();
});

const keys = [
  { label: "1", sub: "" },
  { label: "2", sub: "ABC" },
  { label: "3", sub: "DEF" },
  { label: "4", sub: "GHI" },
  { label: "5", sub: "JKL" },
  { label: "6", sub: "MNO" },
  { label: "7", sub: "PQRS" },
  { label: "8", sub: "TUV" },
  { label: "9", sub: "WXYZ" },
  { label: "*", sub: "" },
  { label: "0", sub: "" },
  { label: "#", sub: "" },
];
</script>

<template>
  <div class="w-[280px] mx-auto font-sans group/phone" tabindex="0">
    <div class="flex items-center justify-center w-full">
      <div class="relative w-full">
        <input
          ref="inputRef"
          v-model="value"
          class="w-full !h-14 !text-[1.75rem] !leading-normal text-n-slate-12 bg-n-background select-none px-1 py-2 !pe-[25px] text-center outline-none transition-all"
          :class="
            value
              ? 'border-b-2 border-n-slate-10 focus:!outline-n-blue-5'
              : 'border-b border-transparent focus:border-n-slate-9'
          "
          type="text"
          @input="value = value.replace(/[^0-98#*+]/g, '')"
          @keydown.enter="emit('call', value)"
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

    <!-- Tabs Navigation -->
    <div class="flex gap-1 mb-4 bg-n-solid-1 rounded-lg p-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex-1 flex flex-col items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all"
        :class="
          activeTab === tab.id
            ? 'bg-n-solid-2 text-n-slate-12 shadow-sm'
            : 'text-n-slate-11 hover:text-n-slate-12 hover:bg-n-solid-2/50'
        "
        @click="activeTab = tab.id"
      >
        <span :class="tab.icon" class="w-4 h-4" />
        <!-- <span>{{ tab.label }}</span> -->
      </button>
    </div>

    <!-- Tab Content -->
    <div class="h-[355px] relative">
      <!-- Dialpad Tab -->
      <div v-if="activeTab === 'dialpad'" class="h-full">
        <div class="grid grid-cols-3 gap-3 px-2">
          <div
            v-for="key in keys"
            :key="key.label"
            class="select-none aspect-square rounded-full bg-n-solid-2 border border-n-weak flex flex-col items-center justify-center cursor-pointer transition-all duration-100 ease-in-out"
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
      </div>

      <!-- Contacts Tab -->
      <div v-else-if="activeTab === 'history'" class="px-2 h-full">
        <div class="space-y-2 overflow-y-auto h-full">
          <div
            v-for="contact in phoneNumbers"
            :key="contact.number"
            class="px-4 py-3 bg-n-solid-2 border border-n-weak rounded-lg cursor-pointer hover:bg-n-solid-active transition-colors"
          >
            <div class="text-sm font-medium text-n-slate-12">
              {{ contact.name }}
            </div>
            <div class="text-xs text-n-slate-11 mt-0.5">
              {{ contact.number }}
            </div>
          </div>
          <div
            v-if="phoneNumbers.length === 0"
            class="text-center text-n-slate-11 py-8"
          >
            {{ $t("sip.DIALPAD.NO_CONTACTS") }}
          </div>
        </div>
      </div>

      <!-- Functional Buttons Tab -->
      <div v-else-if="activeTab === 'functions'" class="px-2 h-full relative">
        <div class="h-full flex items-center justify-center">
          <BtnGroupActive />
        </div>
        <div
          v-if="showOptionsOverlay"
          class="absolute rounded-lg inset-0 bg-n-solid-1/95 backdrop-blur-sm z-10 cursor-auto p-3 flex flex-col"
        >
          <!-- Header with back button -->
          <div
            class="h-10 flex items-center justify-start bg-n-solid-2/50 rounded-lg cursor-pointer hover:bg-n-solid-3 active:scale-[.98] transition-all duration-100 ease-in-out mb-3"
            @click="hideOptionsOverlay"
          >
            <span class="i-lucide-arrow-left w-5 h-5 mx-3 cursor-pointer" />
            <span class="text-sm font-medium text-n-slate-11">{{
              $t("sip.DIALPAD.BACK")
            }}</span>
          </div>

          <!-- Content Area -->
          <div class="flex-1 overflow-y-auto">
            <ForwardView :show="currentView === 'forward'" />
            <UsersView
              :show="currentView === 'users'"
              :contacts="phoneNumbers"
              @select-contact="applyDial"
            />
            <MenuView
              :show="currentView === 'menu'"
              @hold-call="() => {}"
              @transfer="() => {}"
              @add-to-contacts="() => {}"
            />
            <SettingsView
              :show="currentView === 'settings'"
              @advanced-settings="() => {}"
            />
          </div>
        </div>
      </div>

      <!-- Incoming Call Overlay -->
      <div class="group-hover/phone:hidden group-focus/phone:hidden">
        <IncomingCallOverlay
          :show="props.isIncomingActive"
          :remote-identity="props.remoteIdentity"
        />
      </div>
    </div>

    <div class="flex gap-2 items-center mt-6">
      <button
        class="flex-1 p-3 rounded-full rounded-r-none bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:active:scale-100"
        :disabled="!value && !props.hasActiveSession"
        :class="{
          'animate-loader-pulse': props.isIncomingActive,
        }"
        @click="emit('call', value)"
      >
        <span class="i-lucide-phone w-7 h-7" />
      </button>
      <button
        class="flex-1 p-3 rounded-full rounded-l-none bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:active:scale-100"
        :class="{
          'animate-loader-pulse': props.isIncomingActive,
        }"
        :disabled="!props.hasActiveSession"
        @click="emit('hangup')"
      >
        <span class="i-lucide-phone w-7 h-7 rotate-[135deg]" />
      </button>
    </div>
  </div>
</template>
