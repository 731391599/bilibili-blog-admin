<template>
  <!-- 根据路由 渲染菜单 -->
  <!-- 我们需要菜单的名字和图标 -->
  <el-menu :collapse="isCollapse" :collapse-transition="false" router>
    <template v-for="route in routes">
      <!-- 判断是否有子路有 -->
      <!-- 没有子路有 -->
      <el-menu-item
        v-if="!route.children"
        :key="route.path"
        :index="route.path"
      >
        <i :class="route.meta.icon"></i>
        <span slot="title">{{ route.meta.menu }}</span>
      </el-menu-item>
      <!-- 存在子路有 -->
      <el-submenu v-else :key="route.path" :index="route.path">
        <template slot="title">
          <i :class="route.meta.icon"></i>
          <span slot="title">{{ route.meta.menu }}</span>
        </template>
        <el-menu-item
          v-for="subRoute in route.children"
          :key="subRoute.path"
          :index="subRoute.path"
        >
          <i :class="subRoute.meta.icon"></i>
          <span slot="title">{{ subRoute.meta.menu }}</span>
        </el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isCollapse"]),
    routes() {
      const routes = this.$router.options.routes[1].children.filter((item) => {
        return !item.hide;
      });

      return routes;
    },
  },
};
</script>

<style></style>
