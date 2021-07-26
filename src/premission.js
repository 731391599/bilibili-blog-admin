import router from "@/router";
import store from "@/store";
// 白名单
const whiteRoute = ["/login"];
router.beforeEach(async (to, from, next) => {
  if (whiteRoute.includes(to.path)) {
    next();
  } else {
    const hasToken = store.getters.token;
    if (hasToken) {
      const userId = store.getters.user_id;
      const userInfo = store.getters.user_info;
      // 获取vuex中的路由
      const asyncRoutes = store.getters.asyncRoutes;
      if (userInfo.userId && asyncRoutes.length) {
        next();
      } else {
        try {
          // 获取路由
          const routes = await store.dispatch("SET_ROUTES");
          //  添加动态路由
          routes.forEach((route) => {
            router.addRoute("Main", route);
          });
          // 获取用户信息
          await store.dispatch("SET_USER_INFO", userId);
          // 解决页面刷新白屏
          await next({ ...to, replace: true });
        } catch (e) {
          console.log(e);
          next("/login");
          store.dispatch("LOGOUT");
        }
      }
    } else {
      next("/login");
    }
  }
});
