import * as JsSIP from "jssip";
import { sipBus } from "../../eventBus";
import type { SipState, SipConfig } from "../types";
import type { RTCSession } from "jssip/lib/RTCSession";

// Create emitter wrapper for toast messages
const emitter = {
  emit: (event: string, payload?: Record<string, unknown>) => {
    sipBus.emit(event as any, payload as any);
  },
};

// Action context type
export type ActionCtx = {
  commit: (type: string, payload?: unknown) => void;
  dispatch: (type: string, payload?: unknown) => Promise<unknown>;
  state: SipState;
};

/**
 * Helper function to clean up UA event listeners
 * Prevents memory leaks by removing all event handlers
 */
function cleanupUA(ua: JsSIP.UA | null): void {
  if (ua) {
    // Remove all event listeners to prevent memory leaks
    ua.removeAllListeners();
  }
}

/**
 * UA-related actions
 * Handles User Agent initialization, destruction, and connection management
 */
export const uaActions = {
  /**
   * Initialize SIP User Agent
   * Sets up WebSocket connection, registers with SIP server, and attaches event handlers
   */
  init({ commit, dispatch, state }: ActionCtx, config: SipConfig): void {
    // Clean up existing UA if present to prevent memory leaks
    if (state.ua) {
      cleanupUA(state.ua);
      try {
        state.ua.stop();
      } catch {
        // Ignore errors during cleanup
      }
    }

    const socket = new JsSIP.WebSocketInterface(config.ws_servers);
    const configuration = {
      sockets: [socket],
      uri: `sip:${config.user}@${config.domain}`,
      authorization_user: config.user,
      password: config.password,
      display_name: config.display_name,
      register: true,
    };

    const ua = new JsSIP.UA(configuration);
    commit("SET_CONNECTION", ua);
    commit("SET_CONFIG", config);

    ua.on("connected", () => {
      commit("SET_CONNECTED", true);
      localStorage.setItem("sip_config", JSON.stringify(config));
    });

    ua.on("disconnected", () => {
      commit("SET_CONNECTED", false);
      commit("SET_REGISTERED", false);
    });

    ua.on("registered", () => {
      commit("SET_REGISTERED", true);
    });

    ua.on("registrationFailed", (e: unknown) => {
      commit("SET_REGISTERED", false);
      emitter.emit("newToastMessage", {
        message: "SIP Registration Failed: " + e,
        type: "error",
      });
    });

    ua.on(
      "newRTCSession",
      (data: { session: RTCSession; originator: string }) => {
        commit("SET_ACTIVE_SESSION", data.session);

        // Extract remote identity (caller ID)
        const remoteIdentity =
          data.session.remote_identity?.display_name ||
          data.session.remote_identity?.uri?.user ||
          "Unknown";
        commit("SET_REMOTE_IDENTITY", remoteIdentity);

        if (data.originator === "remote") {
          // session.direction will be 'incoming'
          commit("SET_DIRECTION", { incoming: true, outgoing: false });
          commit("SET_CALL_STATUS", "ringing"); // incoming starts as ringing
          emitter.emit("newToastMessage", {
            message: `Incoming Call from ${remoteIdentity}`,
            type: "info",
          });
        } else {
          // session.direction will be 'outgoing'
          commit("SET_DIRECTION", { incoming: false, outgoing: true });
          commit("SET_CALL_STATUS", "calling"); // outgoing starts as calling
          emitter.emit("newToastMessage", {
            message: "Outgoing Call",
            type: "info",
          });
        }
        // Setup all session event handlers
        dispatch("setupSessionEvents", data.session);
      }
    );
    ua.start();
  },

  /**
   * Destroy SIP User Agent
   * Cleans up all resources, terminates sessions, and removes event handlers
   */
  destroy({ commit, state }: ActionCtx): void {
    if (state.ua) {
      try {
        state.ua.terminateSessions();
        cleanupUA(state.ua); // Remove all event listeners before stopping
        state.ua.stop();
        state.ua.unregister();
      } catch (error) {
        emitter.emit("newToastMessage", {
          message: "Error destroying UA: " + error,
          type: "error",
        });
      }
    }

    // Finally, clear all state and config
    localStorage.removeItem("sip_config");
    commit("SET_CONNECTION", null);
    commit("SET_REGISTERED", false);
    commit("SET_CONNECTED", false);
    commit("SET_CONFIG", null);
  },
};
