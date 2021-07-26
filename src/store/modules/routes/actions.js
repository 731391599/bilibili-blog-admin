import { SET_ROUTES } from "./constant";
import { route_list } from "@/api/routes";
const actions = {
  [SET_ROUTES]({ commit }, data) {
    return new Promise((resolve, reject) => {
      route_list(data)
        .then((res) => {
          // 处理路由 过滤参数
          const asyncRoutes = filterAsyncRoutes(res.data);
          // 存路由
          commit(SET_ROUTES, asyncRoutes);
          resolve(asyncRoutes);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};

function filterAsyncRoutes(routes) {
  const asyncRoutes = [];
  routes.forEach((route) => {
    // 参数
    route.meta = {
      icon: route.icon || "",
      menu: route.menuName,
    };

    if (!route.component) {
      // 不存在 有子路由
      route.component = routerView;
      // 处理嵌套路由
      if (route?.children?.length) {
        route.children = filterAsyncRoutes(route.children);
      }
    } else {
      try {
        // 引入路径
        const component = require("@/views" + route.component + ".vue").default;
        route.component = component;
      } catch (e) {
        console.log(e);
      }
    }
    asyncRoutes.push(route);
  });

  return asyncRoutes;
}

const routerView = {
  render: (h) => h("router-view"),
};

export default actions;
