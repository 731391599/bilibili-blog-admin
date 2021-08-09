const path = require("path"); // 引入node 处理路径模块
const px2rem = require("postcss-plugin-px2rem");
function resolve(dir) {
  return path.join(__dirname, dir);
}

const px2remOptions = {
  rootValue: 19.2,
  unitPrecision: 5,
  // propWhiteList: [],
  // propBlackList: [],
  // exclude: false,
  // selectorBlackList: [],
  // ignoreIdentifier: false,
  // replace: true,
  mediaQuery: false,
  minPixelValue: 0,
};

// 线上引入cdn资源
// 开发 本地资源
// 是否为生产模式
const isProd = process.env.NODE_ENV.startsWith("prod");

const externals = {
  "element-ui": "ELEMENT",
  axios: "axios",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  vue: "Vue",
};
// mavon-editor 后面放到自己的oss上
// https://www.bootcdn.cn/
// 上线后 将cdn资源放到oss或cos上
const cdn = {
  css: [
    "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/theme-chalk/index.min.css",
  ],
  js: [
    "https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js",
    "https://cdn.bootcdn.net/ajax/libs/vue-router/3.5.2/vue-router.min.js",
    "https://cdn.bootcdn.net/ajax/libs/vuex/3.6.2/vuex.min.js",
    "https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js",
    "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/index.min.js",
  ],
};

module.exports = {
  chainWebpack: (config) => {
    // 生产环境
    config.when(isProd, (config) => {
      // 改变入口
      config.entry("app").clear().add("./src/main-prod.js");
      config.set("externals", externals);
      config.plugin("html").tap((args) => {
        args[0].cdn = cdn;
        return args;
      });
    });
    // 开发环境
    config.when(!isProd, (config) => {
      // 改变入口
      config.entry("app").clear().add("./src/main-dev.js");
    });
    // 路径别名
    config.resolve.alias.set("@", resolve("src"));
  },
  // 配置代理
  devServer: {
    proxy: {
      "/admin": {
        target: "http://127.0.0.1:7001",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        //   px2rem 不支持行内样式的编译
        plugins: [px2rem(px2remOptions)],
      },
    },
  },
};
