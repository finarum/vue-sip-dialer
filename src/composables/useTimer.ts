import { ref, type Ref } from "vue";

/**
 * Creates a timer that counts seconds in a specified direction
 * @param initialSeconds - Starting number of seconds
 * @param direction - Direction to count: 1 (up), -1 (down), 0 (stopped). Default: -1
 * @returns Object with timer value, formatted time, and control functions
 */
export function useTimer(initialSeconds: number, direction: -1 | 0 | 1 = -1) {
  const seconds = ref(initialSeconds);
  const currentDirection = ref(direction);
  let timerId: ReturnType<typeof setInterval> | null = null;

  /**
   * Formats seconds into MM:SS format
   */
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(Math.abs(totalSeconds) / 60);
    const secs = Math.abs(totalSeconds) % 60;
    const sign = totalSeconds < 0 ? "-" : "";
    return `${sign}${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const formattedTime: Ref<string> = ref(formatTime(seconds.value));

  /**
   * Starts or resumes the timer
   */
  const start = () => {
    if (timerId !== null || currentDirection.value === 0) return;

    timerId = setInterval(() => {
      if (currentDirection.value === 0) {
        stop();
        return;
      }

      seconds.value += currentDirection.value;
      formattedTime.value = formatTime(seconds.value);

      // Stop if counting down reaches 0
      if (currentDirection.value === -1 && seconds.value <= 0) {
        seconds.value = 0;
        formattedTime.value = formatTime(0);
        stop();
      }
    }, 1000);
  };

  /**
   * Stops the timer
   */
  const stop = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  /**
   * Resets the timer to initial value
   */
  const reset = () => {
    stop();
    seconds.value = initialSeconds;
    formattedTime.value = formatTime(initialSeconds);
  };

  /**
   * Sets the direction of counting
   * @param newDirection - 1 (up), -1 (down), 0 (stop)
   */
  const setDirection = (newDirection: -1 | 0 | 1) => {
    currentDirection.value = newDirection;
    if (newDirection === 0) {
      stop();
    } else if (timerId === null) {
      start();
    }
  };

  /**
   * Sets the current seconds value
   */
  const setSeconds = (newSeconds: number) => {
    seconds.value = newSeconds;
    formattedTime.value = formatTime(newSeconds);
  };

  return {
    seconds,
    formattedTime,
    direction: currentDirection,
    start,
    stop,
    reset,
    setDirection,
    setSeconds,
  };
}
