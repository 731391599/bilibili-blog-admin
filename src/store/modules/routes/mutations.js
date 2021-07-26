import { SET_ROUTES } from "./constant";
const mutations = {
  [SET_ROUTES](state, routes) {
    state.asyncRoutes = routes;
  },
};

export default mutations;
