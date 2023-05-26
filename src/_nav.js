export default {
  items: [
    {
      name: "ادمین",
      url: "#",
      icon: "fa fa-home",
      children: [
        {
          name: "پیشخوان",
          url: "/admin/dashboard",
          icon: "fa fa-home",
        },
        {
          name: "کادر درمان",
          url: "/admin/doctors",
          icon: "fa fa-user-md",
        },
        {
          name: "گزارش کادر درمان",
          url: "/admin/report",
          icon: "fa fa-file-text-o",
        },
        {
          name: "خدمات",
          url: "/admin/services",
          icon: "fa fa-list",
        },

        {
          name: "خدمات ارائه شده",
          url: "/admin/renderedServices",
          icon: "fa fa-list",
        },
        {
          name: "درخواست ها",
          url: "/admin/requests",
          icon: "fa fa-list",
        },
      ],
    },

    {
      name: "بیمار",
      url: "#",
      icon: "fa fa-home",
      children: [
        {
          name: "خانه",
          url: "/reception/dashboard",
          icon: "fa fa-home",
        },
        {
          name: "فرایندهای درمان",
          url: "/Therapy",
          icon: "fa fa-list",
        },
        {
          name: "آموزش",
          url: "/learning",
          icon: "fa fa-list",
        },
        {
          name: "پشتیبانی",
          url: "/support",
          icon: "fa fa-list",
        },
        {
          name: "ملاقات حضوری",
          url: "/appointment",
          icon: "fa fa-list",
        },
        {
          name: "حساب کاربری",
          url: "/profile",
          icon: "fa fa-list",
        },
      ],
    },
  ],
  receptionItems: [
    {
      name: "خانه",
      url: "/reception/dashboard",
      icon: "fa fa-home",
    },
    {
      name: "کادر درمان",
      url: "/reception/doctors",
      icon: "fa fa-user-md",
    },
    {
      name: "گزارش کادر درمان",
      url: "/reception/report",
      icon: "fa fa-file-text-o",
    },

    {
      name: "خدمات در درمانگاه",
      url: "#",
      icon: "fa fa-list",
      children: [
        {
          name: "مدیریت درخواست ها",
          url: "/reception/requests",
          icon: "fa fa-check-square-o",
        },
        {
          name: "خدمات ارائه شده",
          url: "/reception/renderedServices",
          icon: "fa fa-check-square-o",
        },
      ],
    },
    {
      name: "خدمات در منزل",

      url: "#",
      icon: "fa fa-list",
      children: [
        {
          name: "ثبت درخواست",
          url: "/reception/NewHomeCare",
          icon: "fa fa-plus-square-o",
        },
        {
          name: "مدیریت درخواست ها",
          url: "/reception/homeCares",
          icon: "fa fa-check-square-o",
        },
      ],
    },
    {
      name: "تغییر اطلاعات شیفت",
      url: "/reception/ChangeShiftDetails",
      icon: "fa fa-cog",
    },
    {
      name: "تغییر رمز عبور",
      url: "/reception/changePassword",
      icon: "fa fa-lock",
    },
  ],
  adminItems: [
    {
      name: "پیشخوان",
      url: "/admin/dashboard",
      icon: "fa fa-home",
    },
    {
      name: "بیماران",
      url: "/admin/patients",
      icon: "fa fa-users",
    },
    {
      name: "مدیریت منابع انسانی",
      url: "#",
      icon: "fa fa-users",
      children: [
        {
          name: "افزودن نیرو انسانی",
          url: "/admin/newPerson",
          icon: "fa fa-user-md",
        },
        {
          name: "کادر درمان",
          url: "/admin/doctors",
          icon: "fa fa-user-md",
        },
        {
          name: "کادر اداری و پذیرش",
          url: "/admin/receptions",
          icon: "fa fa-user-circle-o",
        },
        {
          name: "کارکنان خدمات",
          url: "/admin/employees",
          icon: "fa fa-users",
        },
        {
          name: "کارمندان",
          url: "/admin/allEmployees",
          icon: "fa fa-users",
        },
        {
          name: "گزارش ساعات فعالیت",
          url: "/admin/activityHours",
          icon: "fa fa-clock-o",
        },
        {
          name: "لیست مرخصی‌ها",
          url: "/admin/leaveList",
          icon: "mdi-list-status",
        },
      ],
    },
    {
      name: "گزارش‌ها",
      url: "#",
      icon: "fa fa-file-text-o",
      children: [
        {
          name: "مدیریت مالی",
          url: "/admin/report",
          icon: "fa fa-file-text-o",
        },
        {
          name: "گزارش روند",
          url: "/admin/processreport",
          icon: "fa fa-bar-chart",
        },
      ],
    },
    {
      name: "درخواست‌های درمانگاه",
      url: "/admin/requests",
      icon: "fa fa-medkit",
    },
    {
      name: "درخواست‌های در منزل",
      url: "/admin/homeCares",
      icon: "fa fa-medkit",
    },
    {
      name: "سرویس‌های درمانی",
      url: "#",
      icon: "fa fa-medkit",
      children: [
        {
          name: "افزودن سرویس",
          url: "/admin/addService",
          icon: "fa fa-list",
        },
        {
          name: " سرویس‌های در درمانگاه",
          url: "/admin/services",
          icon: "fa fa-list",
        },
        {
          name: "سرویس‌های دندانپزشکی",
          url: "/admin/dentalServices",
          icon: "fa fa-list",
        },
        {
          name: "سرویس‌های در منزل",
          url: "/admin/HomeServices",
          icon: "fa fa-list",
        },
      ],
    },
    {
      name: "سرویس‌های ارائه شده",
      url: "/admin/renderedServices",
      icon: "fa fa-medkit",
    },
    {
      name: "تنظیمات",
      url: "#",
      icon: "fa fa-cog",
      children: [
        {
          name: "مدیریت بیمه",
          url: "/admin/insurance",
          icon: "fa fa-universal-access",
        },
        {
          name: "تغییر رمز عبور",
          url: "/admin/changePassword",
          icon: "fa fa-lock",
        },
      ],
    },
  ],
};

// attributes: { disabled: true },
