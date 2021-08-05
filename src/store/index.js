import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    token: null,
    isAdmin: false,
    contentBodyClass: null
  },
  mutations: {
    updateToken(state, token) {
      state.token = token
    },
    setAdminFlag(state, flag) {
      state.isAdmin = flag;
    },
    setContentBodyClass(state, cls) {
      state.contentBodyClass = cls;
    }
  },
  plugins: [createPersistedState()],
});