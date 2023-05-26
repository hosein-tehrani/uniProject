// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "core-js/es6/promise";
import "core-js/es6/string";
import "core-js/es7/array";
import Vue from "vue";
import App from "./App";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import "vue-toastification/dist/index.css";
//import 'material-design-icons-iconfont/dist/material-design-icons.css';
// importing b-vue seperately
// This imports the dropdown and table plugins
import { TablePlugin } from "bootstrap-vue";
Vue.use(TablePlugin);

//vue-excel-xlsx for excel export
import VueExcelXlsx from "vue-excel-xlsx";
Vue.use(VueExcelXlsx);

// to use axios globally
import Axios from "axios";
Vue.prototype.$http = Axios;

// html-to-Paper plugin for making pdf from divs
import VueHtmlToPaper from "vue-html-to-paper";
import utilities from "./mixins/utilities";
const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=no", "scrollbars=yes"],
  styles: [
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-vue/2.19.0/bootstrap-vue.min.css",
    "/print.css" //css stylings should be add to this file in public folder
  ]
};
Vue.use(VueHtmlToPaper, options);

Vue.mixin(utilities);

new Vue({
  el: "#app",

  data: {},
  store,
  router,
  template: "<App/>",

  components: {
    App
  },
  vuetify,

  mounted() {}
});
