const state = {
  nav: {
    teacherItems: [
      {
        name: "خانه",
        route: "/prof/dashboard",
        icon: "home",
      },
      {
        name: "مدیریت بیماران",
        route: "/prof/Patients",
        icon: "fa fa-users",
      },
      {
        name: "کادر درمان",
        route: "/prof/doctors",
        icon: "fa fa-user-md",
      },
      {
        name: "گزارش کادر درمان",
        route: "/prof/report",
        icon: "fa fa-file-text-o",
      },
      // {
      //   name: "تغییر رمز عبور",
      //   route: "/prof/changePassword",
      //   icon: "fa fa-lock",
      // },
    ],
    adminItems: [
      {
        name: "پیشخوان",
        route: "/admin/dashboard",
        icon: "fa fa-home",
      },
      {
        name: "اساتید",
        route: "/admin/professors",
        icon: "fa fa-users",
      },
      {
        name: "عناوین درسی",
        route: "/admin/Lessons",
        icon: "fa fa-users",
      },
      {
        name: "کلاس ها",
        route: "/admin/Classes",
        icon: "fa fa-users",
      },
      // {
      //   name: "تغییر رمز عبور",
      //   route: "/admin/changePassword",
      //   icon: "fa fa-lock",
      // },
    ],
  },
};

const getters = {
  nav: (state) => {
    return state.nav;
  },
};

export default {
  state,
  getters,
};
