import type { SipState, CallStatus } from './types';

// Getters for computed state values
export const getters = {
  isReady: (state: SipState): boolean =>
    state.isRegistered && state.isConnected,

  callStatusText: (state: SipState): CallStatus => state.callStatus,

  // Active means "call in progress for UI": ringing or confirmed/active
  hasInProgressCall: (state: SipState): boolean =>
    !!state.activeSession && ['ringing', 'calling'].includes(state.callStatus),

  isIncomingActive: (state: SipState): boolean =>
    !!state.activeSession &&
    state.activeSession.direction === 'incoming' &&
    ['ringing', 'active'].includes(state.callStatus),

  isOutgoingActive: (state: SipState): boolean =>
    !!state.activeSession &&
    state.activeSession.direction === 'outgoing' &&
    ['calling', 'ringing', 'active'].includes(state.callStatus),
  hasActiveSession: (state: SipState): boolean =>
    !!state.activeSession &&
    ['ringing', 'calling', 'active', 'connecting'].includes(state.callStatus),
};
