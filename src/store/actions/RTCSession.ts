import { sipBus } from "../../eventBus";
import type { RTCSession } from "jssip/lib/RTCSession";
import type { ActionCtx } from "./UA";

// Create emitter wrapper for toast messages
const emitter = {
  emit: (event: string, payload?: Record<string, unknown>) => {
    sipBus.emit(event as any, payload as any);
  },
};

/**
 * Setup session event handlers
 * Attaches all lifecycle, media, and signaling event handlers to a session
 */
export function setupSessionEvents(
  { commit }: ActionCtx,
  session: RTCSession
): void {
  // ========== Call Initiation Events ==========

  /**
   * Fired just before the initial INVITE is sent (outgoing calls only).
   * Provides a chance to mangle the SIP INVITE or its SDP.
   * EXECUTION ORDER: 1st - Only for outgoing calls
   */
  session.on("sending", () => {
    commit("SET_CALL_STATUS", "calling");
    emitter.emit("newToastMessage", {
      message: "Sending call request...",
      type: "info",
    });
  });

  // ========== Media Setup Events ==========

  /**
   * Fired once the underlying RTCPeerConnection is created.
   * Sets up peer connection status and remote audio playback.
   * EXECUTION ORDER: 2nd - Before connecting
   */
  session.on("peerconnection", (e: { peerconnection: RTCPeerConnection }) => {
    commit("SET_CALL_STATUS", "connecting");
    emitter.emit("newToastMessage", {
      message: "Peer connection established",
      type: "info",
    });

    const pc = e.peerconnection;

    // Set up handler for new tracks
    pc.ontrack = (event: RTCTrackEvent) => {
      if (event.streams && event.streams[0]) {
        const remoteAudio = new Audio();
        remoteAudio.srcObject = event.streams[0];

        // Store audio element in state for cleanup
        commit("SET_REMOTE_AUDIO", remoteAudio);

        remoteAudio.play().catch((err: unknown) => {
          emitter.emit("newToastMessage", {
            message: "Error playing remote audio: " + err,
            type: "error",
          });
        });
      }
    };

    // Also check for existing tracks (in case they were added before this handler)
    pc.getReceivers().forEach((receiver) => {
      if (receiver.track && receiver.track.kind === "audio") {
        const stream = new MediaStream([receiver.track]);
        const remoteAudio = new Audio();
        remoteAudio.srcObject = stream;
        commit("SET_REMOTE_AUDIO", remoteAudio);
        remoteAudio.play().catch((err: unknown) => {
          emitter.emit("newToastMessage", {
            message: "Error playing remote audio: " + err,
            type: "error",
          });
        });
      }
    });
  });

  /**
   * Fired after the local media stream is added into RTCSession
   * and before ICE gathering starts for initial INVITE or 200 OK response.
   * EXECUTION ORDER: 3rd - After peerconnection is created
   */
  session.on("connecting", () => {
    commit("SET_CALL_STATUS", "connecting");
    emitter.emit("newToastMessage", {
      message: "Connecting call...",
      type: "info",
    });
  });

  /**
   * Fired for each gathered local ICE candidate.
   * Allows stopping ICE gathering early if needed.
   * EXECUTION ORDER: 4th - During ICE gathering (multiple times)
   */
  session.on("icecandidate", () => {
    /* emitter.emit('newToastMessage', {
      message: 'ICE candidate gathered',
      type: 'info',
    }); */
  });

  /**
   * Fired before passing remote SDP to RTC engine and before sending local SDP.
   * Provides mechanism to modify incoming and outgoing SDP.
   * EXECUTION ORDER: 5th - During SDP negotiation (multiple times)
   */
  session.on("sdp", (e: { originator: string; type: string; sdp: string }) => {
    emitter.emit("newToastMessage", {
      message: `SDP ${e.type} (${e.originator})`,
      type: "info",
    });
  });

  // ========== Call Progress Events ==========

  /**
   * Fired when receiving or generating a 1XX SIP class response (>100) to INVITE.
   * Indicates call is ringing or in progress.
   * EXECUTION ORDER: 6th - After INVITE is sent/received
   */
  session.on("progress", () => {
    commit("SET_CALL_STATUS", "ringing");
    emitter.emit("newToastMessage", {
      message: "Call in progress...",
      type: "info",
    });
  });

  /**
   * Fired when the call is accepted (2XX received/sent).
   * The remote side has accepted the call.
   * EXECUTION ORDER: 7th - When call is answered
   */
  session.on("accepted", () => {
    commit("SET_CALL_STATUS", "active");
    emitter.emit("newToastMessage", {
      message: "Call accepted",
      type: "success",
    });
  });

  /**
   * Fired when the call is confirmed (ACK received/sent).
   * Media is now established and the call is fully active.
   * EXECUTION ORDER: 8th - Final confirmation, call is now active
   */
  session.on("confirmed", () => {
    commit("SET_CALL_STATUS", "active");
    emitter.emit("newToastMessage", {
      message: "Call confirmed",
      type: "success",
    });
  });

  // ========== Active Call Events ==========

  /**
   * Fired for an incoming or outgoing DTMF tone.
   * Triggered when DTMF digits are sent or received during a call.
   * EXECUTION ORDER: During active call - when DTMF is sent
   */
  session.on(
    "newDTMF",
    (e: { originator: string; dtmf: unknown; request?: unknown }) => {
      emitter.emit("newToastMessage", {
        message: `DTMF tone: ${e.originator}`,
        type: "info",
      });
    }
  );

  /**
   * Fired for an incoming or outgoing SIP INFO message.
   * Used for mid-call signaling information.
   * EXECUTION ORDER: During active call - when INFO is sent/received
   */
  session.on("newInfo", () => {
    emitter.emit("newToastMessage", {
      message: "SIP INFO received",
      type: "info",
    });
  });

  /**
   * Fired when the local media is muted.
   * Indicates which media tracks (audio/video) are muted.
   * EXECUTION ORDER: During active call - when mute is triggered
   */
  session.on("muted", (e: { audio?: boolean; video?: boolean }) => {
    if (e.audio) {
      commit("SET_MUTED", true);
    }
    emitter.emit("newToastMessage", {
      message: `Muted - Audio: ${e.audio}, Video: ${e.video}`,
      type: "info",
    });
  });

  /**
   * Fired when the local media is unmuted.
   * Indicates which media tracks (audio/video) are unmuted.
   * EXECUTION ORDER: During active call - when unmute is triggered
   */
  session.on("unmuted", (e: { audio?: boolean; video?: boolean }) => {
    if (e.audio) {
      commit("SET_MUTED", false);
    }
    emitter.emit("newToastMessage", {
      message: `Unmuted - Audio: ${e.audio}, Video: ${e.video}`,
      type: "info",
    });
  });

  /**
   * Fired when the user or the peer puts the other side on hold.
   * Indicates the call audio is paused.
   * EXECUTION ORDER: During active call - when hold is triggered
   */
  session.on("hold", (e: { originator: string }) => {
    commit("SET_ON_HOLD", true);
    emitter.emit("newToastMessage", {
      message: `Call on hold (${e.originator})`,
      type: "info",
    });
  });

  /**
   * Fired when the user or the peer resumes from hold.
   * Indicates the call audio is resumed.
   * EXECUTION ORDER: During active call - when unhold is triggered
   */
  session.on("unhold", (e: { originator: string }) => {
    commit("SET_ON_HOLD", false);
    commit("SET_CALL_STATUS", "active");
    emitter.emit("newToastMessage", {
      message: `Call resumed (${e.originator})`,
      type: "info",
    });
  });

  // ========== Re-negotiation Events ==========

  /**
   * Fired when an in-dialog re-INVITE is received.
   * Used to modify session parameters during an active call.
   * EXECUTION ORDER: During active call - when session needs modification
   */
  session.on("reinvite", () => {
    emitter.emit("newToastMessage", {
      message: "Re-INVITE received",
      type: "info",
    });
  });

  /**
   * Fired when an in-dialog UPDATE is received.
   * Used to update session parameters without changing media.
   * EXECUTION ORDER: During active call - when session needs update
   */
  session.on("update", () => {
    emitter.emit("newToastMessage", {
      message: "UPDATE received",
      type: "info",
    });
  });

  // ========== Transfer Events ==========

  /**
   * Fired when an in-dialog REFER is received.
   * Indicates a call transfer request to another party.
   * EXECUTION ORDER: During active call - when transfer is initiated
   */
  session.on("refer", () => {
    emitter.emit("newToastMessage", {
      message: "Call transfer requested",
      type: "info",
    });
  });

  /**
   * Fired when an out-of-dialog INVITE with Replaces header is received.
   * Indicates a request to replace this session with a new one.
   * EXECUTION ORDER: During active call - when replacement is requested
   */
  session.on("replaces", () => {
    emitter.emit("newToastMessage", {
      message: "Call replacement requested",
      type: "info",
    });
  });

  // ========== Call Termination Events ==========

  /**
   * Fired when an established call ends.
   * Provides the cause of termination.
   * EXECUTION ORDER: Final - Normal call termination
   */
  session.on("ended", (e: { cause: string }) => {
    commit("SET_CALL_STATUS", "ended");
    // commit('RESET_CALL_STATE');
    emitter.emit("newToastMessage", {
      message: `Call ended: ${e.cause}`,
      type: "info",
    });
  });

  /**
   * Fired when the session was unable to establish.
   * Provides the cause of failure.
   * EXECUTION ORDER: Final - Call failed to establish
   */
  session.on("failed", (e: { cause: string }) => {
    commit("SET_CALL_STATUS", "failed");
    // commit('RESET_CALL_STATE');
    emitter.emit("newToastMessage", {
      message: `Call failed: ${e.cause}`,
      type: "error",
    });
  });

  // ========== Error Events ==========

  /**
   * Fired when getUserMedia() fails.
   * Indicates failure to access local media devices (microphone/camera).
   * EXECUTION ORDER: Can occur at any time during media setup
   */
  session.on("getusermediafailed", (e: DOMException) => {
    emitter.emit("newToastMessage", {
      message: `Media access failed: ${e.message}`,
      type: "error",
    });
  });

  /**
   * Fired when createOffer() fails.
   * Indicates failure to create SDP offer for the call.
   * EXECUTION ORDER: Can occur during initial setup or re-negotiation
   */
  session.on("peerconnection:createofferfailed", (e: DOMException) => {
    emitter.emit("newToastMessage", {
      message: `Create offer failed: ${e.message}`,
      type: "error",
    });
  });

  /**
   * Fired when createAnswer() fails.
   * Indicates failure to create SDP answer for the call.
   * EXECUTION ORDER: Can occur during initial setup or re-negotiation
   */
  session.on("peerconnection:createanswerfailed", (e: DOMException) => {
    emitter.emit("newToastMessage", {
      message: `Create answer failed: ${e.message}`,
      type: "error",
    });
  });

  /**
   * Fired when setLocalDescription() fails.
   * Indicates failure to set local SDP description.
   * EXECUTION ORDER: Can occur during initial setup or re-negotiation
   */
  session.on("peerconnection:setlocaldescriptionfailed", (e: DOMException) => {
    emitter.emit("newToastMessage", {
      message: `Set local description failed: ${e.message}`,
      type: "error",
    });
  });

  /**
   * Fired when setRemoteDescription() fails.
   * Indicates failure to set remote SDP description.
   * EXECUTION ORDER: Can occur during initial setup or re-negotiation
   */
  session.on("peerconnection:setremotedescriptionfailed", (e: DOMException) => {
    emitter.emit("newToastMessage", {
      message: `Set remote description failed: ${e.message}`,
      type: "error",
    });
  });
}
