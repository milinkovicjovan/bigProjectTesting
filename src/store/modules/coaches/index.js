import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      // 1 minute we dont need to auto-fetch
      coaches: [],
    };
  },
  mutations,
  actions,
  getters,
};
