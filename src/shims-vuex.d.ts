// Type declarations for Vuex store - inferred from the actual store module
import type { SipState } from './store/types';
import sipModule from './store/index';

// Infer types from the actual store module
type SipGetters = typeof sipModule.getters;
type SipActions = typeof sipModule.actions;

// Root state interface that includes all modules
export interface RootState {
  sip: SipState;
}

// Typed getters interface - inferred from the actual getters
export interface TypedGetters {
  'sip/isReady': ReturnType<SipGetters['isReady']>;
  'sip/callStatusText': ReturnType<SipGetters['callStatusText']>;
  'sip/hasInProgressCall': ReturnType<SipGetters['hasInProgressCall']>;
  'sip/isIncomingActive': ReturnType<SipGetters['isIncomingActive']>;
  'sip/isOutgoingActive': ReturnType<SipGetters['isOutgoingActive']>;
  'sip/hasActiveSession': ReturnType<SipGetters['hasActiveSession']>;
}

// Typed actions interface - inferred from the actual actions
// Extract the second parameter (payload) from each action
export interface TypedActions {
  'sip/init': Parameters<SipActions['init']>[1];
  'sip/destroy': undefined;
  'sip/setupSessionEvents': Parameters<SipActions['setupSessionEvents']>[1];
  'sip/makeCall': Parameters<SipActions['makeCall']>[1];
  'sip/answerCall': undefined;
  'sip/hangup': undefined;
  'sip/sendDTMF': Parameters<SipActions['sendDTMF']>[1];
}
