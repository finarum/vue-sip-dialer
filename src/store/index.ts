// Main SIP store module - combines all parts
import { state } from './state';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions, TIME_OUT_CALL } from './actions';

export { TIME_OUT_CALL };

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
