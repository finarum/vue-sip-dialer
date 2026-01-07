// Type declarations for vuex to work around module resolution issues
// vuex types are at node_modules/vuex/types/index.d.ts but exports resolution fails
declare module "vuex" {
  import { App, InjectionKey, Ref } from "vue";

  export interface Store<S> {
    state: S;
    getters: any;
    commit: (type: string, payload?: any, options?: any) => void;
    dispatch: (type: string, payload?: any, options?: any) => Promise<any>;
    subscribe: (fn: (mutation: any, state: S) => void) => () => void;
    subscribeAction: (fn: (action: any, state: S) => void) => () => void;
    replaceState: (state: S) => void;
    watch: <T>(
      getter: (state: S, getters: any) => T,
      cb: (value: T, oldValue: T) => void,
      options?: any
    ) => () => void;
    registerModule: (
      path: string | string[],
      module: any,
      options?: any
    ) => void;
    unregisterModule: (path: string | string[]) => void;
    hasModule: (path: string | string[]) => boolean;
    hotUpdate: (options: any) => void;
  }

  export function createStore<S>(options: any): Store<S>;
  export function useStore<S = any>(
    key?: InjectionKey<Store<S>> | string
  ): Store<S>;
}
