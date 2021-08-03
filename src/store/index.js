import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    token: null,
    isAdmin: false
  },
  mutations: {
    updateToken(state, token) {
      state.token = token
    },
    setAdminFlag(state, flag) {
      state.isAdmin = flag;
    }
  },
  plugins: [createPersistedState()],
});