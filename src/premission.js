import router from "@/router";
import store from "@/store";
// 白名单
const whiteRoute = ["/login"];
router.beforeEach((to, from, next) => {
  if (whiteRoute.includes(to.path)) {
    next();
  } else {
    const hasToken = store.getters.token;
    if (hasToken) {
      const userId = store.getters.user_id;
      const userInfo = store.getters.user_info;
      if (userInfo.userId) {
        next();
      } else {
        store
          .dispatch("SET_USER_INFO", userId)
          .then(() => {
            next();
          })
          .catch(() => {
            next("/login");
            store.dispatch("LOGOUT");
          });
      }
      next();
    } else {
      next("/login");
    }
  }
});
