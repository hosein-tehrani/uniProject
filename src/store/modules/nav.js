const state = {
  nav: {
    profItems: [
      {
        name: "خانه",
        route: "/prof/dashboard",
        icon: "home",
      },
      {
        name: "کلاس‌ها",
        route: "/prof/classes",
        icon: "fa fa-users",
      },
      {
        name: "کلاس‌های من",
        route: "/prof/myClasses",
        icon: "fa fa-file-text-o",
      },

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
