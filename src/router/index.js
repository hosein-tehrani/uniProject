import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// Containers
const DefaultContainer = () => import("@/containers/DefaultContainer");
const Page404 = () => import("@/views/Page404");
const Login = () => import("@/views/Login");
const ChangePassword = () => import("@/components/setting/ChangePassword");
const Requests = () => import("@/views/Requests");


// prof PAGES
const Dashboard = () => import("@/views/Prof/Dashboard");

// Admin PAGES

const Professors = () => import("@/views/Admin/Professors");
const Lessons = () => import("@/views/Admin/Lessons");
const Classes = () => import("@/views/Admin/Classes");
const AdminDashboard = () => import("@/views/Admin/Dashboard");
const adminPayments = () => import("@/views/Admin/Payments");

//splash
const Splash = () => import("@/views/Splash");

export default new Router({
  mode: "history", // https://router.vuejs.org/api/#mode
  linkActiveClass: "open active",
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    // prof Pages
    {
      path: "/prof",
      redirect: "/prof/dashboard",
      name: "خانه",
      component: DefaultContainer,
      children: [
        {
          path: "/prof/dashboard",
          name: "داشبورد پذیرش",
          component: Dashboard,
        },
        {
          path: "/prof/Classes",
          name: "کلاس‌ها",
          component: Classes,
        },
        {
          path: "/prof/changePassword",
          name: "تغییر رمز عبور",
          component: ChangePassword,
        },
      ],
    },

    // Admin Pages
    {
      path: "/admin",
      redirect: "/admin/dashboard",
      name: " خانه",
      component: DefaultContainer,
      children: [
        {
          path: "/admin/dashboard/",
          name: "پیشخوان",
          component: AdminDashboard,
        },
        {
          path: "/admin/Professors/",
          name: "اساتید",
          component: Professors,
        },
        {
          path: "/admin/Lessons",
          name: "دروس",
          component: Lessons,
        },
        {
          path: "/admin/Classes",
          name: "کلاس ها",
          component: Classes,
        },
        {
          path: "/admin/Requests/",
          name: "درخواست‌ها",
          component: Requests,
        },
        {
          path: "/admin/changePassword",
          name: "تغییر رمز عبور",
          component: ChangePassword,
        },
        {
          name: "مدیریت پرداخت‌ها",
          path: "/admin/payments",
          component: adminPayments,
        },
      ],
    },

    // { path: "/unauthorize", component: Page403 },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/Splash",
      name: "Splash",
      component: Splash,
    },
    { path: "*", component: Page404 },
    { path: "/", redirect: "/Splash" },
  ],
});
