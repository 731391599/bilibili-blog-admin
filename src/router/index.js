import Vue from "vue";
import VueRouter from "vue-router";
import LayoutBasic from "@/layouts/LayoutBasic"; // 布局组件 不需要使用懒加载

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routerView = {
  render: (h) => h("router-view"),
};
// 路由
// 路由配置
// 我们先默认写死路由 后面会根据接口动态分配路由
const routes = [
  {
    path: "/login", // 路由的路径
    name: "Login",
    component: () => import("@/views/login"), // 使用路由懒加载
  },
  {
    path: "/",
    name: "",
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
      // 后面会有其他的模块

      {
        path: "/category",
        name: "Category",
        meta: {
          menu: "分类管理",
          icon: "el-icon-s-grid",
        },
        component: () => import("@/views/sys/category"),
      },
      {
        path: "/draft",
        name: "Draft",
        meta: {
          menu: "草稿管理",
          icon: "el-icon-folder",
        },
        component: () => import("@/views/sys/draft"),
      },
      {
        path: "/audit",
        name: "Audit",
        meta: {
          menu: "审核管理",
          icon: "el-icon-document-checked",
        },
        component: () => import("@/views/sys/audit"),
      },
      // 有嵌套子路有
      {
        path: "/articles",
        name: "Articles",
        redirect: "/articles/list",
        meta: {
          menu: "文章管理",
          icon: "el-icon-document",
        },
        component: routerView,
        children: [
          {
            path: "/articles/list",
            name: "ArticlesList",
            meta: {
              menu: "文章列表", // 二级路由不需要图标
            },
            component: () => import("@/views/sys/articles"),
          },
          {
            path: "/articles/add",
            name: "ArticlesAdd",
            meta: {
              menu: "新增文章", // 二级路由不需要图标
            },
            component: () => import("@/views/sys/articles/edit"),
          },
        ],
      },
      {
        path: "/user",
        name: "User",
        meta: {
          menu: "用户管理",
          icon: "el-icon-user",
        },
        component: () => import("@/views/sys/user"),
      },
      {
        path: "/roles",
        name: "Roles",
        meta: {
          menu: "权限管理",
          icon: "el-icon-lock",
        },
        component: () => import("@/views/sys/roles"),
      },
      {
        path: "/menus",
        name: "Menus",
        meta: {
          menu: "菜单管理",
          icon: "el-icon-menu",
        },
        component: () => import("@/views/sys/menus"),
      },
      {
        path: "/mine",
        name: "Mine",
        hide: true,
        component: () => import("@/views/sys/mine"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
