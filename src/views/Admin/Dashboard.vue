<template>
  <!-- dashboard template -->
  <div class="animated fadeIn">
    <loading v-if="vLoading" />
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="cards pa-2">
          <v-card-title class="ps-5 pe-5 pt-4">
            <v-row class="card-title-row">
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-row style="align-items:center">
                  <h4 class="ma-3 card-h-title">شیفت در جریان</h4>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-row style="justify-content:flex-end">
                  <div class="mt-5 ms-3 me-3">
                    <v-btn
                      text
                      class="refresh-btn pe-0 ps-0"
                      @click="getDashboardInfoSeperately(1)"
                      :loading="Busy"
                      ><v-icon> refresh</v-icon></v-btn
                    >
                  </div>
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
          <v-card-text class="ps-5 pe-5 pt-5" v-if="dashboardInfo.shift">
            <div class="shift-info" v-if="dashboardInfo.shift.receptionName">
              <v-row>
                <v-col class="details-div">
                  <span class="h4">پذیرش: </span>
                  <span class="h4"
                    >{{ dashboardInfo.shift.receptionName }}
                  </span>
                </v-col>
                <v-col class="mr-auto  details-div">
                  <span class="h4">عنوان شیفت: </span>
                  <span class="h4">{{ dashboardInfo.shift.subject }}</span>
                </v-col>
              </v-row>
              <v-row class=" details-div">
                <v-col>
                  <span class="h4">ساعت آغاز شیفت: </span>
                  <span class="h4">{{ dashboardInfo.shift.startTime }} </span>
                </v-col>
              </v-row>

              <v-row class=" ">
                <v-col class="details-div">
                  <span class="h4">پزشک: </span>
                  <span class="h4">{{ dashboardInfo.shift.doctorName }} </span>
                </v-col>
                <v-col class="mr-auto details-div">
                  <span class="h4">پرستار : </span>
                  <span class="h4">{{ dashboardInfo.shift.nurseName }} </span>
                </v-col>
              </v-row>
              <v-row class="">
                <v-col class="details-div">
                  <span class="h4">پزشک آنکال: </span>
                  <span class="h4">
                    {{ dashboardInfo.shift.oncallDoctorName }}</span
                  >
                </v-col>
                <v-col class="mr-auto details-div">
                  <span class="h4">پرستار آنکال: </span>
                  <span class="h4"
                    >{{ dashboardInfo.shift.oncallNurseName }}
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="details-div">
                  <span class="h4 ">دندانپزشک: </span>
                  <span class="h4"> {{ dashboardInfo.shift.dentistName }}</span>
                </v-col>
                <v-col class="mr-auto details-div">
                  <span class="h4">پرستار دندانپزشک : </span>
                  <span class="h4">
                    {{ dashboardInfo.shift.nurseDentistName }}</span
                  >
                </v-col>
              </v-row>
            </div>
            <div v-else>
              <v-row>
                <v-col class="details-div">
                  <span class="h4">پذیرش: </span>
                  <span class="h4">- </span>
                </v-col>
                <v-col class="mr-auto details-div">
                  <span class="h4">عنوان شیفت: </span>
                  <span class="h4">-</span>
                </v-col>
              </v-row>
              <v-row class=" details-div">
                <v-col>
                  <span class="h4">ساعت آغاز شیفت: </span>
                  <span class="h4">- </span>
                </v-col>
              </v-row>
              <v-row class="mt-2 ">
                <v-col class="details-div">
                  <span class="h4">پزشک: </span>
                  <span class="h4">- </span>
                </v-col>
                <v-col class="mr-auto details-div">
                  <span class="h4">پرستار : </span>
                  <span class="h4">- </span>
                </v-col>
              </v-row>
              <v-row class="">
                <v-col class="details-div">
                  <span class="h4">پزشک آنکال: </span>
                  <span class="h4"> -</span>
                </v-col>
                <v-col class="mr-auto details-div">
                  <span class="h4">پرستار آنکال: </span>
                  <span class="h4">- </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="details-div">
                  <span class="h4 ">دندانپزشک: </span>
                  <span class="h4"> -</span>
                </v-col>
                <v-col class="mr-auto details-div">
                  <span class="h4">پرستار دندانپزشک : </span>
                  <span class="h4"> -</span>
                </v-col>
              </v-row>
            </div>
            <hr class="mt-3" />
            <v-row
              class="shift-table-card pa-3 pb-0"
              v-if="dashboardInfo.fiveShifts"
            >
              <h2 class="mt-2 mb-3 card-h-title">گزارش شیفت های اخیر</h2>
              <b-table
                show-empty
                :fields="Fields"
                :items="dashboardInfo.fiveShifts"
                empty-text="رکوردی برای نمایش وجود ندارد"
                striped
                :busy="Busy"
                :current-page="CurrentPage"
                :per-page="PerPage"
                responsive
                scroll
              >
                <template v-slot:head()="data">
                  <div style="text-align: center; vertical-align: middle;">
                    {{ data.label }}
                  </div>
                </template>
                <template v-slot:cell()="data">
                  <div style="text-align: center; vertical-align: middle">
                    {{ data.value }}
                  </div>
                </template>
                <template v-slot:cell(totalRevenue)="data">
                  <div style="text-align: center; vertical-align: middle">
                    {{ data.value ? Number(data.value).toLocaleString() : '-' }}
                  </div>
                </template>
                <template v-slot:cell(index)="data">
                  <div style="text-align: center; vertical-align: middle">
                    {{ data.index + PerPage * (CurrentPage - 1) + 1 }}
                  </div>
                </template>
                
                <template v-slot:cell(operation)="data">
                  <div style="text-align: center; vertical-align: middle">
                    <v-btn
                      class="q-btn"
                      :to="'/admin/shiftReport/' + data.item.id"
                    >
                      <v-icon>
                        help_outline
                      </v-icon>
                    </v-btn>
                  </div>
                </template>
                <div slot="table-busy" class="text-center primary--text my-2">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    class="align-middle"
                  ></v-progress-circular>
                </div>
              </b-table>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="cards pa-3 pt-3 pb-3">
          <v-card-title class="ps-3 pe-3 pt-4">
            <v-row class="card-title-row">
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-row style="align-items:center">
                  <h4 class="ma-3 card-h-title">خدمات در منزل</h4>
                </v-row>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
                lg="6"
                style="align-items:center;justify-content: flex-end;display: flex;"
              >
                <v-btn
                  text
                  class="refresh-btn mt-2 "
                  @click="getDashboardInfoSeperately(2)"
                  :loading="barBusy1"
                  ><v-icon> refresh</v-icon></v-btn
                >
                <v-btn
                  class="primary-btn d-btn py-6 ms-0 me-0 shift-btn"
                  style="float:left"
                  @click="goToHomeCares"
                >
                  <v-icon class="ms-2 me-2">settings </v-icon>
                  مدیریت درخواست‌ها
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text
            class="ps-3 pe-3 pt-3 mt-0 "
            v-if="dashboardInfo.outRequests"
          >
            <v-row>
              <v-col class="details-div">
                <span class="h4">درخواست‌ها: </span>
                <span class="h4"
                  >{{ dashboardInfo.outRequests.allCount }}
                </span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h4"> درخواست‌ها‌ی انجام نشده: </span>
                <span class="h4">
                  {{ dashboardInfo.outRequests.allNotDoneCount }}</span
                >
              </v-col>
            </v-row>
            <v-row class="">
              <v-col class="details-div">
                <span class="h4">گزارش نشده: </span>
                <span class="h4"
                  >{{ dashboardInfo.outRequests.allNotReportCount }}
                </span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h4">درخواست‌ها‌ی جدید : </span>
                <span class="h4"
                  >{{ dashboardInfo.outRequests.allNewCount }}
                </span>
              </v-col>
            </v-row>
            <v-row class="mt-0 ">
              <!--<v-col></v-col>-->
              <v-col>

              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="cards mt-4 pa-3 pt-3 pb-3 ps-3 pe-3 ">
          <v-card-text>
            <v-row>
              <v-col>
                <v-btn
                  text
                  class="refresh-btn barChart2-refresh"
                  @click="getDashboardInfoSeperately(3)"
                  :loading="barBusy2"
                  ><v-icon> refresh</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import moment from "moment-jalaali";
export default {
  data() {
    return {
      globalColor: "0,167,183",
      globalColor2: "218,182,196",
      Fields: [
        { key: "index", label: "#" },
        { key: "totalCount", label: "تعداد مراجعه" },
        { key: "totalRevenue", label: "  درآمد (تومان)" },
        { key: "subject", label: "عنوان شیفت" },
        { key: "startTime", label: "تاریخ " },
        { key: "operation", label: " عملیات" }
      ],
      Items: [],
      CurrentPage: 1,
      PerPage: 5,
      perPageOptions: [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" }
      ],
      dataBar: {
        labels: [],
        datasets: [
          {
            label: "درخواست‌ها",
            backgroundColor: "#00a7b7",
            data: []
          }
        ]
      },
      dataBar2: {
        labels: [],
        datasets: [
          {
            label: "تعداد مراجعه‌ها",
            backgroundColor: "#00a7b7",
            data: []
          },
          {
            label: "تعداد بیماران جدید",
            backgroundColor: "#dab6c4",
            data: []
          }
        ]
      },
      TotalRows: "",
      Busy: false,

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
      dashboardInfo: {},
      loaded: false,
      loaded1: false,
      loaded2: false,
      barBusy1: false,
      barBusy2: false,
      role: "",
      optionsBar: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontFamily: "projectMainFont"
              }
            }
          ],
          xAxes: [
            {
              // Change here
              barPercentage: 0.4,
              ticks: {
                fontFamily: "projectMainFont"
              }
            }
          ]
        },
        legend: {
          display: true,
          position: "right",
          labels: {
            fontFamily: "projectMainFont",
            fontSize :10
          }
        },
        tooltips: {
          titleFontFamily: "projectMainFont",
          bodyFontFamily: "projectMainFont"
        }
      }
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
    getDashboardInfoSeperately(part) {
      if (part == "1") {
        this.Busy = true;
      } else if (part == "2") {
        this.loaded1 = false;
        this.barBusy1 = true;
      } else {
        this.loaded2 = false;
        this.barBusy2 = true;
      }
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
          if (res.status == 200) {
            if (part == "1") {
              this.Busy = false;
              this.dashboardInfo.shift = res.data.shift;
              //alert(this.dashboardInfo.shift)
              this.dashboardInfo.fiveShifts = res.data.fiveShifts;
            } else if (part == "2") {
              this.dashboardInfo.outRequests = res.data.outRequests;
              this.loaded1 = false;
              this.dataBar.labels = res.data.outRequestsChart.labels;
              this.dataBar.datasets[0].data =
                res.data.outRequestsChart.datasets[0].data;

              this.loaded1 = true;
              this.barBusy1 = false;
            } else {
              this.loaded2 = false;
              this.dataBar2.labels = res.data.clinicChart.labels;
              this.dataBar2.datasets[0].data =
                res.data.clinicChart.datasets[0].data;

              this.dataBar2.datasets[1].data =
                res.data.clinicChart.datasets[1].data;
              this.loaded2 = true;
              this.barBusy2 = false;
            }
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch(err => {
          this.barBusy1 = false;
          this.barBusy2 = false;
          this.Busy = false;
          this.toast("خطا: " + err.data, "error");
        });
    }
  },
  mounted() {
    this.role = localStorage.getItem("role");
    // this.getDashboardInfo();
    this.getTime();
  }
};
</script>
