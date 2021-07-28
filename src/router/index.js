import Vue from "vue";
import VueRouter from "vue-router";
import LayoutBasic from "@/layouts/LayoutBasic"; // 布局组件 不需要使用懒加载

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

// 路由
// 路由配置
// 我们先默认写死路由 后面会根据接口动态分配路由
export const routes = [
  {
    path: "/login", // 路由的路径
    name: "Login",
    component: () => import("@/views/login"), // 使用路由懒加载
  },
  //   加载当这个了路由下
  {
    path: "/",
    name: "Main",
    component: LayoutBasic,
    redirect: "/dashboard", // 路由重定向 当我们访问'/' 重定向到我们主页
    children: [
      // 嵌套路由
      {
        // 作为我们的主页
        path: "/dashboard",
        name: "DashBoard",
        // 我们将菜单名和图标放到meta属性里
        meta: {
          menu: "主页",
          icon: "el-icon-s-home",
        },
        component: () => import("@/views/sys/dashboard"),
      },
      {
        path: "/mine",
        name: "Mine",
        hide: true,
        component: () => import("@/views/sys/mine"),
      },
      // 先暂时卸载前端页面 后面放到数据库中 需要改表
      {
        path: "/articles/edit/:id",
        hide: true,
        component: () => import("@/views/sys/articles/edit"), // 与edit共用页面
        props: true,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
