import { ref, computed } from "vue";

export function useTimer(initialSeconds: number, direction: number) {
  const seconds = ref(initialSeconds);
  const isRunning = ref(false);
  let intervalId: number | undefined;

  const formattedTime = computed(() => {
    const mins = Math.floor(seconds.value / 60);
    const secs = seconds.value % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  });

  const start = () => {
    if (isRunning.value) return;
    isRunning.value = true;
    intervalId = window.setInterval(() => {
      seconds.value += direction;
      if (seconds.value <= 0 && direction < 0) {
        stop();
        seconds.value = 0;
      }
    }, 1000);
  };

  const stop = () => {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    isRunning.value = false;
  };

  const reset = () => {
    stop();
    seconds.value = initialSeconds;
  };

  return {
    seconds,
    isRunning,
    formattedTime,
    start,
    stop,
    reset,
  };
}
