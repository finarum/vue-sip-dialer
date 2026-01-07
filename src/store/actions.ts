import * as JsSIP from "jssip";
import { sipBus } from "../eventBus";
import { uaActions } from "./actions/UA";
import { setupSessionEvents } from "./actions/RTCSession";
import type { ActionCtx } from "./actions/UA";

// Create emitter wrapper that maps to sipBus for toast messages
// In the parent app, this would use the actual shared/helpers/mitt emitter
const emitter = {
  emit: (event: string, payload?: Record<string, unknown>) => {
    // Emit to sipBus for internal handling
    sipBus.emit(event as any, payload as any);
  },
};

JsSIP.debug.disable();

// Timeout constant for call operations (used in Phone.vue)
export const TIME_OUT_CALL = 5000;

/**
 * Combined SIP actions
 * Merges UA-related and call operation actions
 */
export const actions = {
  ...uaActions,

  // Session event setup (from RTCSession.ts)
  setupSessionEvents,

  /**
   * Make an outgoing call
   * Terminates any existing session and initiates a new call
   */
  makeCall({ state }: ActionCtx, { target }: { target: string }): void {
    if (!state.ua) {
      emitter.emit("newToastMessage", {
        message: "SIP connection not initialized. Please refresh the page.",
        type: "error",
      });
      return;
    }

    if (!state.isRegistered) {
      emitter.emit("newToastMessage", {
        message: "Not registered to SIP server. Please wait for registration.",
        type: "warning",
      });
      return;
    }

    if (!target || target.trim() === "") {
      emitter.emit("newToastMessage", {
        message: "Please enter a number to call",
        type: "warning",
      });
      return;
    }

    // Check for existing active session and terminate it to prevent orphaned calls
    if (state.activeSession) {
      try {
        emitter.emit("newToastMessage", {
          message: "Terminating previous call...",
          type: "info",
        });
        state.activeSession.terminate();
      } catch {
        // Ignore errors during termination (session might already be ended)
      }
    }

    try {
      const targetURI = `sip:${target}@${state.config?.domain}`;
      const callOptions = {
        mediaConstraints: { audio: true, video: false },
        pcConfig: {
          iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
        },
        sessionTimersExpires: 1800,
      };

      const session = state.ua.call(targetURI, callOptions);

      if (!session) {
        emitter.emit("newToastMessage", {
          message: "Failed to initiate call",
          type: "error",
        });
      }
    } catch (error: unknown) {
      emitter.emit("newToastMessage", {
        message: "Error initiating call: " + error,
        type: "error",
      });
    }
  },

  /**
   * Answer an incoming call
   * Checks for existing calls and answers the incoming session
   */
  answerCall({ state }: ActionCtx): void {
    const session = state.activeSession;
    if (!session) {
      emitter.emit("newToastMessage", {
        message: "No active call to answer",
        type: "warning",
      });
      return;
    }

    if (state.callStatus === "active" || state.callStatus === "calling") {
      emitter.emit("newToastMessage", {
        message: "Already in a call",
        type: "warning",
      });
      return;
    }

    try {
      session.answer({
        mediaConstraints: { audio: true, video: false },
        pcConfig: {
          iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
        },
      });
    } catch (error: unknown) {
      emitter.emit("newToastMessage", {
        message: "Error answering call: " + error,
        type: "error",
      });
    }
  },

  /**
   * Hang up the current call
   * Terminates the active session and resets call state`${error}`
   */
  hangup({ state }: ActionCtx): void {
    if (state.activeSession) {
      try {
        state.activeSession.terminate();
      } catch (error: unknown) {
        emitter.emit("newToastMessage", {
          type: "error",
          message: String(error),
        });
      }
    }
  },

  /**
   * Send DTMF tone during an active call
   * Validates tone and sends it via the active session
   */
  sendDTMF({ state }: ActionCtx, { tone }: { tone: string }): void {
    const session = state.activeSession;

    const options = {
      transportType: JsSIP.C.DTMF_TRANSPORT.RFC2833,
    };

    // Check if there's an active session
    if (!session) {
      emitter.emit("newToastMessage", {
        message: "No active call to send DTMF",
        type: "warning",
      });
      return;
    }

    // Validate DTMF tone (0-9, *, #, A-D)
    const validDTMF = /^[0-9*#A-D]$/;
    if (!validDTMF.test(tone)) {
      emitter.emit("newToastMessage", {
        message: `Invalid DTMF tone: ${tone}`,
        type: "error",
      });
      return;
    }

    try {
      session.sendDTMF(tone, options);
    } catch (error: unknown) {
      emitter.emit("newToastMessage", {
        message: "Error sending DTMF: " + error,
        type: "error",
      });
    }
  },

  /**
   * Transfer the current call to another number
   * Uses SIP REFER to transfer the active call
   */
  referCall({ state }: ActionCtx, { target }: { target: string }): void {
    const session = state.activeSession;

    // Check if there's an active session
    if (!session) {
      emitter.emit("newToastMessage", {
        message: "No active call to transfer",
        type: "warning",
      });
      return;
    }

    try {
      const targetURI = `sip:${target}@${state.config?.domain}`;
      session.refer(targetURI);
    } catch (error: unknown) {
      emitter.emit("newToastMessage", {
        message: "Error transferring call: " + error,
        type: "error",
      });
    }
  },
};
