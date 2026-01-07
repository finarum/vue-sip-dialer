<script setup lang="ts">
import { ref, watch } from "vue";
import { useSipStore } from "./composables/useSipStore";
import { useTimer } from "./composables/useTimer";
import DialPad from "./components/DialPad.vue";
import InfoConnection from "./components/InfoConnection.vue";

// Use the typed SIP store composable - all properties are now fully typed!
const {
  callStatus,
  activeSession,
  hasActiveSession,
  isIncomingActive,
  dispatch,
  remoteIdentity,
} = useSipStore();

// Call UI state
const dialpadInput = ref(""); // Real-time input value from dialpad
const currentCallNumber = ref("");
const isMuted = ref(false);

// Timer for call duration
const callTimer = useTimer(0, 1); // Start at 0 seconds, count up
// const timer_to_call = useTimer(TIME_OUT_CALL / 1000, -1); // Uncomment if needed

const handleCall = (number?: string) => {
  // If there's an incoming call, answer it
  if (isIncomingActive.value) {
    currentCallNumber.value = remoteIdentity.value || "Unknown";
    callTimer.reset();
    callTimer.start();
    dispatch("sip/answerCall");
    return;
  }

  // Otherwise, make an outgoing call
  if (!number) return;
  currentCallNumber.value = number;
  callTimer.reset();
  callTimer.start();
  dispatch("sip/makeCall", {
    target: number,
  });
};

const handleHangup = () => dispatch("sip/hangup");

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

watch(dialpadInput, (newValue) => {
  if (hasActiveSession.value && newValue.length > 0) {
    const newChar = newValue[newValue.length - 1];
    if (newChar && /^[0-9*#]$/.test(newChar)) {
      dispatch("sip/sendDTMF", {
        tone: newChar,
      });
    }
  }
});

// Toggle mute is available via this function if needed
// Usage: expose via template or call directly
function toggleMute() {
  if (activeSession.value) {
    isMuted.value = !isMuted.value;
    const sdh = (activeSession.value as any).sessionDescriptionHandler;
    if (sdh?.peerConnection) {
      sdh.peerConnection.getSenders().forEach((sender: any) => {
        if (sender.track && sender.track.kind === "audio") {
          sender.track.enabled = !isMuted.value;
        }
      });
    }
  }
}

const handlePause = () => {};

const handleForward = () => {
  dispatch("sip/referCall", {
    target: "9001",
  });
};

const handleKeyboard = () => {};

const handleCircle = () => {};

const handleUsers = () => {};

const handleMenu = () => {};

const handleMic = () => {};

const handleSettings = () => {};

// Handling for dblLcick
</script>

<template>
  <Transition name="slide-in-br" appear>
    <div
      class="w-min h-min mx-auto mt-14 p-6 py-12 pb-16 rounded-lg border border-n-blue-4 transition-all duration-300 relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm"
    >
      <InfoConnection />
      <!-- Dialpad - Show only when idle -->
      <div class="animate-fadeIn">
        <DialPad
          v-model="dialpadInput"
          :has-active-session
          :is-incoming-active
          :remote-identity
          @call="handleCall"
          @hangup="handleHangup"
          @sip-pause="handlePause"
          @sip-forward="handleForward"
          @sip-keyboard="handleKeyboard"
          @sip-circle="handleCircle"
          @sip-users="handleUsers"
          @sip-menu="handleMenu"
          @sip-mic="handleMic"
          @sip-settings="handleSettings"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Slide in from bottom-right animation */
.slide-in-br-enter-active {
  animation: slide-in-br 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-in-br-leave-active {
  animation: slide-out-br 0.3s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes slide-in-br {
  from {
    opacity: 0;
    transform: translate(100px, 100px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes slide-out-br {
  from {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(100px, 100px) scale(0.8);
  }
}
</style>
