import Vue from "vue";
import Toast from "vue-toastification";

const loading = () => import("../components/Loading.vue"); //import loading component
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});
export default {
  components: {loading},
  data() {
    return {
      // baseUrl: "http://baas.sarmadbs.com/",
      baseUrl: "http://localhost:3000",
      //baseUrl: "http://192.168.1.6:3001",
      vLoading: false,
      whenIsEmpty: "",
      vMoneyOptions: {
        decimal: ",",
        thousands: ",",
        precision: 0,
        length: 16
      },
    };
  },
  methods: {
    toast(message, type) {
      this.$toast[type](message, {
        position: type == 'success' ? 'top-left' : 'top-center',
        icon: false,
        closeButton: false,
        timeout: 3000,
      });
    },
    movePlaceholderToTop() {
      let placeholder = document.querySelector('.datepicker-placeholder');
        placeholder.style.top = '-7px';
        placeholder.style.backgroundColor = '#fff';
        placeholder.style.padding = '0 5px';
        placeholder.style.fontSize = '12px';
        placeholder.style.color = '#00a7b7 ';
    },
    movePlaceholderBack() {
      let placeholder = document.querySelector('.datepicker-placeholder');
      if (this.userData.birthday !== null) {
        placeholder.style.top = '-7px';
        placeholder.style.backgroundColor = '#fff';
        placeholder.style.padding = '0 5px';
        placeholder.style.fontSize = '12px';
        placeholder.style.color = '#00a7b7 ';
      } else {
        placeholder.style.top = '14px';
        placeholder.style.backgroundColor = 'transparent';
        placeholder.style.padding = '0';
        placeholder.style.fontSize = '16px';
        placeholder.style.color = '#707070 ';
      }
    }
  }
};
