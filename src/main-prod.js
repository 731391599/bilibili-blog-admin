import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize-css";
import { setDomFontSize } from "./setRem";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "./premission";

setDomFontSize();
Vue.config.productionTip = false;

Vue.use(mavonEditor);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
