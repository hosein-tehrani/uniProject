<template>
  <!-- dashboard template -->
  <div class="animated fadeIn">
    <loading v-if="vLoading" />
        <v-card class="cards pa-2">
          <v-card-title class="ps-5 pe-5 pt-4">
            <v-row class="card-title-row">
              <v-col cols="12" sm="6" md="6" lg="6">
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-row style="justify-content:flex-end">
                  <div class="date-div">
                    <span class="span-1">
                      ساعت
                    </span>
                    <span class="span-2">
                      {{ time }}
                    </span>
                  </div>
                  <div class="date-div ms-3 me-3">
                    <span class="span-1">
                      روز
                    </span>
                    <span class="span-2">
                      {{ splitDate(currentDate).day }}
                    </span>
                  </div>

                  <div class="date-div">
                    <span class="span-1">
                      ماه
                    </span>
                    <span class="span-2">
                      {{ splitDate(currentDate).month }}
                    </span>
                  </div>
                </v-row>
              </v-col>
            </v-row>

          </v-card-title>
          <v-card-text>
            <h4>
              مدیر گروه محترم به پنل مدیریت دروس و اساتید خوش آمدید
              </h4>
              <h5>
                شما در این پنل امکان:
              <ul>
                <li>مدیریت و اضافه کردن اساتید</li>
                <li>مدیریت و اضافه کردن دروس</li>
                <li>مدیریت و اضافه کردن  کلاس‌ها</li>
                <li>مدیریت و خروجی گرفتن از لیست کلاس‌ها</li>
              </ul>
              را دارید</h5>
          </v-card-text>
        </v-card>
  </div>
</template>
<script>
import moment from "moment-jalaali";
export default {
  data() {
    return {
      currentDate: moment(new Date()).format("jYYYY-jMM-jDD"),
      time: "",
      persianMonths: [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند"
      ],
      role: "",
    };
  },
  methods: {
    goToHomeCares() {
      this.$router.push("homeCares");
    },
    splitDate(Date) {
      var dateparts = Date.split("-");
      var year = dateparts[0];
      var day = dateparts[2];
      var month = this.persianMonths[parseInt(dateparts[1] - 1)];
      return {
        day: day,
        month: month,
        year: year
      };
    },
    getTime() {
      var now = new Date().toLocaleTimeString("fa-IR");
      now.split(":");
      now = now.substring(0, now.length - 3);
      this.time = now;
      setTimeout(() => {
        this.getTime();
      }, 60000);
    },
    getDashboardInfo() {
      this.loaded = false;
      this.vLoading = true;
      this.$http
        .post(
          this.baseUrl + "/clinic/dashboard/adminDashboard",
          {},
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token")
            }
          }
        )
        .then(res => {
          this.vLoading = false;

          if (res.status == 200) {
            this.dashboardInfo = res.data;

            this.dataBar.labels = res.data.outRequestsChart.labels;
            this.dataBar.datasets[0].data =
              res.data.outRequestsChart.datasets[0].data;

            this.dataBar2.labels = res.data.clinicChart.labels;
            this.dataBar2.datasets[0].data =
              res.data.clinicChart.datasets[0].data;

            this.dataBar2.datasets[1].data =
              res.data.clinicChart.datasets[1].data;

            this.loaded = true;
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch(err => {
          this.vLoading = false;
          this.toast("خطا: " + err.data, "error");
        });
    },
  },
  mounted() {
    this.role = localStorage.getItem("role");
    // this.getDashboardInfo();
    this.getTime();
  }
};
</script>
<style>
*{
  text-align: right;
  direction: rtl;
}
h3{
  text-align: center;
}
h5{
  line-height: 3.5rem;
}
</style>