import * as JsSIP from "jssip";
import { markRaw } from "vue";
import type { SipState, ActionContext, SipConfig, CallParams } from "./types";

// JsSIP.debug.disable("JsSIP:*");

let TIME_HUNG_UP: number | undefined;
export const TIME_OUT_CALL = 5000;

export default {
  namespaced: true,

  state: (): SipState => ({
    ua: null,
    activeSession: null,
    isRegistered: false,
    isConnected: false,
    callStatus: "idle",
    // callStatus: "active"
  }),

  getters: {
    isReady: (state: SipState): boolean =>
      state.isRegistered && state.isConnected,
    callStatusText: (state: SipState): string => {
      switch (state.callStatus) {
        case "calling":
          return "calling";
        case "ringing":
          return "ringing";
        case "active":
          return "active";
        case "failed":
          return "failed";
        case "ended":
          return "ended";
        default:
          return "";
      }
    },
  },

  mutations: {
    SET_CONNECTION(state: SipState, connection: JsSIP.UA): void {
      state.ua = markRaw(connection);
    },
    SET_ACTIVE_SESSION(state: SipState, session: any): void {
      state.activeSession =
        Object.keys(session).length > 0 ? markRaw(session) : {};
    },
    SET_REGISTERED(state: SipState, value: boolean): void {
      state.isRegistered = value;
    },
    SET_CONNECTED(state: SipState, value: boolean): void {
      state.isConnected = value;
    },
    SET_CALL_STATUS(state: SipState, status: SipState["callStatus"]): void {
      state.callStatus = status;
    },
  },

  actions: {
    init(
      { commit, dispatch }: ActionContext<SipState, SipConfig>,
      config: SipConfig
    ): void {
      const socket = new JsSIP.WebSocketInterface(config.ws_servers);
      const configuration = {
        sockets: [socket],
        uri: `sip:${config.user}@${config.domain}`,
        password: config.password,
        display_name: config.display_name,
        register: true,
      };

      const ua = new JsSIP.UA(configuration);
      commit("SET_CONNECTION", ua);

      // Event Handlers
      ua.on("connected", () => {
        commit("SET_CONNECTED", true);
      });

      ua.on("disconnected", () => {
        commit("SET_CONNECTED", false);
        commit("SET_REGISTERED", false);
      });

      ua.on("registered", () => {
        commit("SET_REGISTERED", true);
      });

      ua.on("registrationFailed", (e: any) => {
        commit("SET_REGISTERED", false);
        // commit("SET_CONNECTED", false);
        console.error("SIP Registration Failed", e);
      });

      // Handle new sessions (incoming calls)
      ua.on("newRTCSession", (data: any) => {
        commit("SET_ACTIVE_SESSION", data.session);
        dispatch("setupSessionEvents", data.session);
      });
      // Start the UA
      ua.start();
    },

    setupSessionEvents(
      { commit }: ActionContext<SipState, any>,
      session: any
    ): void {
      session.on("failed", () => {
        commit("SET_CALL_STATUS", "failed");
        commit("SET_ACTIVE_SESSION", {});
      });

      session.on("ended", () => {
        commit("SET_CALL_STATUS", "ended");
        commit("SET_ACTIVE_SESSION", {});
      });

      session.on("confirmed", () => {
        commit("SET_CALL_STATUS", "active");
      });

      session.on("accepted", () => {});

      session.on("progress", () => {
        commit("SET_CALL_STATUS", "ringing");
      });

      // Handle media streams using peerconnection event
      session.on("peerconnection", (e: any) => {
        const peerconnection = e.peerconnection;

        peerconnection.ontrack = (event: any) => {
          if (event.streams && event.streams[0]) {
            const remoteAudio = new Audio();
            remoteAudio.srcObject = event.streams[0];
            remoteAudio.play().catch((err: any) => {
              console.error("Error playing remote audio:", err);
            });
          }
        };
      });
    },

    makeCall(
      { commit, dispatch, state }: ActionContext<SipState, any>,
      { target, domain }: CallParams
    ): void {
      if (!state.ua) {
        alert("SIP connection not initialized. Please refresh the page.");
        return;
      }

      if (!state.isRegistered) {
        alert("Not registered to SIP server. Please wait for registration.");
        return;
      }

      if (!target || target.trim() === "") {
        alert("Please enter a number to call");
        return;
      }

      try {
        const targetURI = `sip:${target}@${domain}`;

        const callOptions = {
          mediaConstraints: {
            audio: true,
            video: false,
          },
          pcConfig: {
            iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
          },
          sessionTimersExpires: 1800,
        };

        const session = state.ua.call(targetURI, callOptions);

        if (!session) {
          console.error("ERROR: Failed to create session");
          alert("Failed to initiate call");
          return;
        }

        commit("SET_ACTIVE_SESSION", session);
        commit("SET_CALL_STATUS", "calling");

        dispatch("setupSessionEvents", session);
      } catch (error: any) {
        alert("Error initiating call: " + error);
        commit("SET_CALL_STATUS", "failed");
      }
    },

    hangup({ state, commit }: ActionContext<SipState, any>): void {
      if (TIME_HUNG_UP) {
        clearTimeout(TIME_HUNG_UP);
        TIME_HUNG_UP = undefined;
        commit("SET_CALL_STATUS", "idle");
        return;
      }

      if (state.ua) {
        state.ua.terminateSessions();
        commit("SET_CALL_STATUS", "ended");
      }

      commit("SET_ACTIVE_SESSION", {});

      TIME_HUNG_UP = setTimeout(() => {
        commit("SET_CALL_STATUS", "idle");
      }, TIME_OUT_CALL);
    },
  },
};
