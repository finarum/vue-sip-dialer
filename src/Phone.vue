<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useTimer } from "@sipStore/modules/useTimer";
import { TIME_OUT_CALL } from "@sipStore/modules/sip";
import IndicatorConnected from "@sipComponent/Indicator/IndicatorConnected.vue";
import IndicatorRegistered from "@sipComponent/Indicator/IndicatorRegistered.vue";
import Dropdown from "@sipComponent/Frame/Dropdown.vue";
import DialPad from "./DialPad.vue";
import BtnGroupActive from "./BtnGroupActive.vue";
import { useI18n } from "vue-i18n";

const store = useStore();
const { t } = useI18n();

// SIP state

const isConnected = computed(() => store.state.sip.isConnected);
const isRegistered = computed(() => store.state.sip.isRegistered);
const callStatus = computed(() => store.state.sip.callStatus);
const activeSession = computed(() => store.state.sip.activeSession);
const callStatusText = computed(() => store.getters["sip/callStatusText"]);

// Call UI state
const currentCallNumber = ref("");
const isMuted = ref(false);

// Timer for call duration
const callTimer = useTimer(0, 1); // Start at 0 seconds, count up
const timer_to_call = useTimer(TIME_OUT_CALL / 1000, -1);

// Demo data
const generatedId = ref("");
const currentTime = ref("");
// Lifecycle
onMounted(() => {
  store.dispatch("sip/init", {
    domain: "testsipcontrol.ikujo.com",
    ws_servers: "ws://testfswss.ikujo.com:5066",
    user: "1002",
    password: "9St6f7u3U4ZK",
    display_name: "Anvarjon",
  });

  generatedId.value = Date.now().toString(36);
  currentTime.value = new Date().toUTCString();
});

const handleCall = (phone_number) => {
  currentCallNumber.value = phone_number;
  callTimer.reset();
  callTimer.start();
  store.dispatch("sip/makeCall", {
    target: phone_number,
    domain: "testsipcontrol.ikujo.com",
  });
};

const handleHangup = () => {
  store.dispatch("sip/hangup");
  timer_to_call.reset();
  timer_to_call.start();
};

watch(callStatus, (newStatus) => {
  if (newStatus === "ended" || newStatus === "failed" || newStatus === "idle") {
    callTimer.stop();
    isMuted.value = false;
  }
  if (newStatus === "idle") {
    currentCallNumber.value = "";
    callTimer.reset();
  }
});

const toggleMute = () => {
  if (activeSession.value) {
    isMuted.value = !isMuted.value;
    const sdh = activeSession.value.sessionDescriptionHandler;
    if (sdh?.peerConnection) {
      sdh.peerConnection.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === "audio") {
          sender.track.enabled = !isMuted.value;
        }
      });
    }
  }
};
</script>

<template>
  <div
    class="w-min h-min mx-auto mt-14 p-6 py-12 rounded-lg border border-n-weak transition-all duration-300 relative bg-n-background"
  >
    <div class="flex items-center gap-3 absolute top-2 left-2">
      <IndicatorConnected :connected="isConnected" />
      <IndicatorRegistered v-if="isConnected" :registered="isRegistered" />
    </div>

    <!-- Dialpad - Show only when idle -->
    <div v-if="callStatus === 'idle'" class="animate-fadeIn">
      <DialPad @call="handleCall" />
      <div class="text-center mt-2 text-xs text-n-slate-11">
        {{ t("sip.status") }}
        {{ isConnected ? t("sip.connected") : t("sip.disconnected") }}
        {{ t("sip.registered") }}
        {{ isRegistered ? t("sip.yes") : t("sip.no") }}
      </div>
    </div>

    <!-- Active Call UI - Show when calling/ringing/active -->
    <div v-else class="animate-fadeIn">
      <div class="w-[280px] mx-auto text-center flex flex-col gap-9">
        <!-- Call Status Header -->
        <div class="mb-6">
          <div class="text-sm text-n-slate-11 uppercase tracking-wide mb-2">
            {{ t(`sip.${callStatusText}`) }}
          </div>
          <div class="text-2xl font-semibold text-n-slate-12 mb-1">
            {{ currentCallNumber }}
          </div>
          <div class="text-sm text-n-slate-11">
            {{ callTimer.formattedTime }}
          </div>
        </div>

        <!-- Animated Call Indicator -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <!-- Pulsing rings for calling/ringing state -->
            <div
              v-if="callStatus === 'calling' || callStatus === 'ringing'"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div
                class="absolute w-[120px] h-[120px] border-[3px] border-n-blue-9/60 rounded-full animate-ripple"
              />
              <div
                class="absolute w-[120px] h-[120px] border-[3px] border-n-blue-9/60 rounded-full animate-ripple [animation-delay:1s]"
              />
            </div>

            <!-- Avatar/Icon -->
            <div
              class="relative w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl"
              :class="callStatus === 'active' ? 'bg-n-teal-9' : 'bg-n-blue-9'"
            >
              <span class="i-lucide-phone w-12 h-12" />
            </div>
          </div>
        </div>

        <!-- Call Controls -->
        <div class="flex justify-center gap-9">
          <!-- Hang Up Button -->
          <div class="flex flex-col items-center gap-2">
            <button
              class="w-16 h-16 rounded-full hover:bg-n-ruby-10 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg"
              :title="t('sip.hangUp')"
              @click="handleHangup"
            >
              <span class="i-lucide-phone-off w-8 h-8" />
            </button>
            <span
              v-if="callStatus !== 'calling'"
              class="text-sm italic text-n-slate-11"
            >
              {{ t("sip.toDialpad") }}
              <span class="text-lg ps-2 pe-1">{{
                timer_to_call.seconds.value
              }}</span>
              {{ t("sip.seconds") }}
            </span>
          </div>

          <!-- Mute Button (only during active call) -->
          <button
            v-if="callStatus === 'active'"
            class="w-16 h-16 rounded-full text-white flex items-center justify-center transition-all active:scale-95 shadow-lg"
            :class="
              isMuted
                ? 'bg-n-slate-11 hover:bg-n-slate-12'
                : 'bg-n-slate-12 hover:bg-n-slate-11'
            "
            :title="isMuted ? t('sip.unmute') : t('sip.mute')"
            @click="toggleMute"
          >
            <span
              :class="isMuted ? 'i-lucide-mic-off' : 'i-lucide-mic'"
              class="w-8 h-8"
            />
          </button>
        </div>

        <Dropdown v-if="callStatus === 'active'">
          <BtnGroupActive />
        </Dropdown>
      </div>
    </div>
  </div>
</template>
