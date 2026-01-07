import type { UA } from 'jssip';
import type { RTCSession } from 'jssip/lib/RTCSession';

// SIP Configuration
export interface SipConfig {
  ws_servers: string;
  user: string;
  domain: string;
  password: string;
  display_name: string;
}

// Call status union type
export type CallStatus =
  | 'idle' // No active call
  | 'calling' // Outgoing call initiated
  | 'connecting' // Call being established
  | 'ringing' // Call ringing (incoming or outgoing)
  | 'active' // Call connected and active
  | 'hold' // Call on hold
  | 'failed' // Call failed
  | 'ended'; // Call ended

// SIP State
export interface SipState {
  ua: UA | null;
  activeSession: RTCSession | null;
  isRegistered: boolean;
  isConnected: boolean;
  callStatus: CallStatus;
  config: SipConfig | null;
  isIncoming: boolean;
  isOutgoing: boolean;
  remoteAudio: HTMLAudioElement | null;
  isActive: boolean;

  // Additional state for complex UI
  isMuted: boolean; // Is local audio muted
  isOnHold: boolean; // Is call on hold
  isTransferring: boolean; // Is call being transferred
  callDuration: number; // Call duration in seconds
  remoteIdentity: string | null; // Remote caller ID/name
  errorMessage: string | null; // Last error message
}
