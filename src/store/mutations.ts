import * as JsSIP from 'jssip';
import { markRaw } from 'vue';
import type { SipState, SipConfig, CallStatus } from './types';
import type { RTCSession } from 'jssip/lib/RTCSession';

/**
 * Helper function to clean up audio element and its media streams
 * Prevents memory leaks by stopping all tracks and clearing references
 */
function cleanupAudio(audio: HTMLAudioElement | null): void {
  if (audio) {
    // Stop all media stream tracks to release resources
    if (audio.srcObject instanceof MediaStream) {
      audio.srcObject.getTracks().forEach(track => track.stop());
    }
    // Clear the source
    audio.srcObject = null;
    // Pause playback
    audio.pause();
  }
}

// Mutations for synchronous state changes
export const mutations = {
  SET_CONNECTION(state: SipState, connection: JsSIP.UA | null): void {
    state.ua = connection ? markRaw(connection) : null;
  },

  SET_ACTIVE_SESSION(state: SipState, session: RTCSession | null): void {
    state.activeSession = session ? markRaw(session) : null;
  },

  SET_REGISTERED(state: SipState, value: boolean): void {
    state.isRegistered = value;
  },

  SET_CONNECTED(state: SipState, value: boolean): void {
    state.isConnected = value;
  },

  SET_CALL_STATUS(state: SipState, status: CallStatus): void {
    state.callStatus = status;
  },

  SET_CONFIG(state: SipState, config: SipConfig | null): void {
    state.config = config;
  },

  SET_DIRECTION(
    state: SipState,
    { incoming, outgoing }: { incoming: boolean; outgoing: boolean }
  ): void {
    state.isIncoming = incoming;
    state.isOutgoing = outgoing;
  },

  SET_REMOTE_AUDIO(state: SipState, audio: HTMLAudioElement | null): void {
    // Clean up old audio before setting new one
    cleanupAudio(state.remoteAudio);
    state.remoteAudio = audio ? markRaw(audio) : null;
  },

  SET_MUTED(state: SipState, value: boolean): void {
    state.isMuted = value;
  },

  SET_ON_HOLD(state: SipState, value: boolean): void {
    state.isOnHold = value;
    if (value) {
      state.callStatus = 'hold';
    }
  },

  SET_TRANSFERRING(state: SipState, value: boolean): void {
    state.isTransferring = value;
  },

  SET_CALL_DURATION(state: SipState, duration: number): void {
    state.callDuration = duration;
  },

  SET_REMOTE_IDENTITY(state: SipState, identity: string | null): void {
    state.remoteIdentity = identity;
  },

  SET_ERROR_MESSAGE(state: SipState, message: string | null): void {
    state.errorMessage = message;
  },
};
