// Composable for fully typed Vuex store access
import { useStore } from 'vuex';
import { computed, type ComputedRef } from 'vue';
import type { RootState, TypedGetters, TypedActions } from '../shims-vuex';
import type { SipState } from '../store/types';

export function useSipStore() {
  const store = useStore();
  const state = store.state as RootState;
  const getters = store.getters as TypedGetters;

  // Type-safe dispatch helper
  function typedDispatch<K extends keyof TypedActions>(
    action: K,
    payload: TypedActions[K]
  ): Promise<unknown> {
    return store.dispatch(action, payload);
  }

  return {
    // State - fully typed
    state: computed(() => state.sip) as ComputedRef<SipState>,
    isConnected: computed(() => state.sip.isConnected),
    isRegistered: computed(() => state.sip.isRegistered),
    callStatus: computed(() => state.sip.callStatus),
    activeSession: computed(() => state.sip.activeSession),
    config: computed(() => state.sip.config),
    isIncoming: computed(() => state.sip.isIncoming),
    isOutgoing: computed(() => state.sip.isOutgoing),
    remoteIdentity: computed(() => state.sip.remoteIdentity),

    // Getters - fully typed
    isReady: computed(() => getters['sip/isReady']),
    callStatusText: computed(() => getters['sip/callStatusText']),
    hasInProgressCall: computed(() => getters['sip/hasInProgressCall']),
    isIncomingActive: computed(() => getters['sip/isIncomingActive']),
    isOutgoingActive: computed(() => getters['sip/isOutgoingActive']),
    hasActiveSession: computed(() => getters['sip/hasActiveSession']),
    // Actions - fully typed with payload validation
    dispatch: store.dispatch,

    // Convenience action methods with type-safe payloads
    init: (config: TypedActions['sip/init']) =>
      typedDispatch('sip/init', config),
    makeCall: (params: TypedActions['sip/makeCall']) =>
      typedDispatch('sip/makeCall', params),
    answerCall: () => typedDispatch('sip/answerCall', undefined),
    hangup: () => typedDispatch('sip/hangup', undefined),
    destroy: () => typedDispatch('sip/destroy', undefined),
    sendDTMF: (params: TypedActions['sip/sendDTMF']) =>
      typedDispatch('sip/sendDTMF', params),
  };
}
