// SIP State interface
export interface SipState {
  session?: any;
  ua: any | null;
  activeSession: any | null;
  isRegistered: boolean;
  isConnected: boolean;
  callStatus: 'idle' | 'calling' | 'ringing' | 'active' | 'failed' | 'ended';
  hangupTimeoutId?: number | undefined;
}

// Vuex ActionContext type for actions
export interface ActionContext<S, R> {
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => Promise<any>;
  state: S;
  getters: any;
  rootState: R;
  rootGetters: any;
}

// SIP Configuration interface
export interface SipConfig {
  ws_servers: string;
  user: string;
  domain: string;
  password: string;
  display_name: string;
}

// Call parameters interface
export interface CallParams {
  target: string;
  domain: string;
}
