import type { SipState } from "./types";

// Initial state factory function
export const state = (): SipState => ({
  ua: null,
  activeSession: null,
  isRegistered: false,
  isConnected: false,
  callStatus: "idle",
  // callStatus: 'active',
  isIncoming: false,
  isOutgoing: false,
  config: null,
  remoteAudio: null,

  // Additional state for complex UI
  isMuted: false,
  isOnHold: false,
  isTransferring: false,
  callDuration: 0,
  remoteIdentity: null,
  errorMessage: null,
  isActive: false,
});
