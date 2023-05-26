import Vue from "vue";
import Vuex from "vuex";
import peopleList from "./modules/peopleList";
import nav from "./modules/nav";


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    peopleList,
    nav
  }
});
