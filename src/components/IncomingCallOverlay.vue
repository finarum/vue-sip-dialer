<script setup>
import { defineProps } from 'vue';

defineProps({
  remoteIdentity: { type: String, default: '' },
  show: { type: Boolean, default: false },
});
</script>

<template>
  <Transition name="slide-down">
    <div
      v-if="show"
      class="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center overflow-hidden"
    >
      <!-- Animated Background Ripples -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="absolute w-24 h-24 rounded-full bg-green-400/20 animate-ripple"
        />
        <div
          class="absolute w-36 h-36 rounded-full bg-emerald-400/15 animate-ripple-delay-1"
        />
        <div
          class="absolute w-48 h-48 rounded-full bg-teal-400/10 animate-ripple-delay-2"
        />
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center gap-4 px-4">
        <!-- Phone Icon with Pulse Glow -->
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl animate-pulse-glow"
        >
          <span class="i-lucide-phone w-8 h-8 text-white animate-shake" />
        </div>

        <!-- Caller Info -->
        <div class="text-center space-y-1.5">
          <div class="text-sm font-semibold text-n-slate-12 animate-slide-up">
            {{ $t('sip.DIALPAD.INCOMING_CALL') }}
          </div>
          <div
            class="text-xl font-bold text-green-600 dark:text-green-400 animate-slide-up-delay truncate max-w-[240px]"
          >
            {{ remoteIdentity || 'Unknown' }}
          </div>
        </div>

        <!-- Pulsing Indicator -->
        <div class="flex items-center gap-1.5 animate-pulse">
          <div class="w-1.5 h-1.5 rounded-full bg-green-500" />
          <div
            class="w-1.5 h-1.5 rounded-full bg-green-500 animation-delay-150"
          />
          <div
            class="w-1.5 h-1.5 rounded-full bg-green-500 animation-delay-300"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Slide Down Transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Ripple Animation */
@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

.animate-ripple {
  animation: ripple 2s ease-in-out infinite;
}

.animate-ripple-delay-1 {
  animation: ripple 2.5s ease-in-out infinite;
  animation-delay: 0.3s;
}

.animate-ripple-delay-2 {
  animation: ripple 3s ease-in-out infinite;
  animation-delay: 0.6s;
}

/* Pulse Glow Animation */
@keyframes pulse-glow {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 0 20px rgba(34, 197, 94, 0.4),
      0 0 40px rgba(34, 197, 94, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow:
      0 0 30px rgba(34, 197, 94, 0.6),
      0 0 60px rgba(34, 197, 94, 0.3),
      0 0 80px rgba(34, 197, 94, 0.1);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 1.5s ease-in-out infinite;
}

/* Shake Animation */
@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.animate-shake {
  animation: shake 0.6s ease-in-out infinite;
}

/* Fade In Animation */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

/* Slide Up Animation */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out 0.2s both;
}

.animate-slide-up-delay {
  animation: slide-up 0.5s ease-out 0.4s both;
}

/* Animation Delays for Pulsing Dots */
.animation-delay-150 {
  animation-delay: 150ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}
</style>
