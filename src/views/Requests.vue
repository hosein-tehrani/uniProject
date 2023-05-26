<template>
  <div class="animated fadeIn">
    <loading v-if="vLoading" />
    <v-col cols="12">
      <v-card-title style="background-color: transparent !important">
        <v-row>
          <v-col>
            <h3>مدیریت درخواست‌ها</h3>
          </v-col>
          <v-col v-if="role == 'reception'">
            <v-btn
              class="primary-btn"
              style="float: left"
              @click="gotoNewService()"
            >
              <v-icon left>add</v-icon>
              <h6 class="mt-1">ثبت درخواست جدید</h6>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card class="cards pa-3">
        <v-card-text>
          <div>
            <v-row class="time-row">
              <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <span id="dateFrom">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    append-icon="calendar_today"
                    v-model="dateFrom"
                    label=" تاریخ از "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="dateFrom"
                  element="dateFrom"
                  color="#00a7b7"
                /> </v-col
              ><v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <span id="dateTo">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    append-icon="calendar_today"
                    v-model="dateTo"
                    label=" تاریخ تا "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="dateTo"
                  element="dateTo"
                  color="#00a7b7"
                />
              </v-col>
            </v-row>
            <v-row class="time-row">
              <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <span id="timeFrom">
                  <v-text-field
                    outlined
                    dense
                    append-icon="schedule"
                    v-model="timeFrom"
                    label=" ساعت از "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="timeFrom"
                  element="timeFrom"
                  color="#00a7b7"
                  type="time"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <span id="timeTo">
                  <v-text-field
                    outlined
                    dense
                    append-icon="schedule"
                    v-model="timeTo"
                    label=" ساعت تا "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="timeTo"
                  element="timeTo"
                  color="#00a7b7"
                  type="time"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  class="submit-btn primary-btn"
                  style="float: right"
                  @click="requests()"
                  :disabled="Busy"
                  >اعمال</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-row>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-autocomplete
                      outlined
                      dense
                      v-model="drName"
                      :items="drNames"
                      item-text="text"
                      item-value="id"
                      clearable
                      label="نام پزشک"
                      class="pa-0"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-autocomplete
                      outlined
                      dense
                      v-model="nurseName"
                      :items="nurseNames"
                      item-text="text"
                      item-value="id"
                      label="نام پرستار"
                      class="pa-0"
                      clearable
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-if="role == 'manager'" class="align-items-center">
              <v-icon class="text-danger mb-2"> priority_high </v-icon>
              <p class="mt-2 ms-2 me-2 text-danger">
                بازه زمانی انتخابی نمی‌تواند بیشتر از 25 ساعت باشد
              </p>
            </v-row>
            <v-row v-if="role == 'reception'" class="align-items-center">
              <v-icon class="text-danger mb-2"> priority_high </v-icon>
              <p class="mt-2 text-danger">
                بازه زمانی انتخابی نمی‌تواند بیشتر از ۱۳ ساعت باشد
              </p>
            </v-row>
            <hr />
            <v-row v-if="role != 'reception'" align-v="end">
              <v-col> </v-col>
              <v-col>
                <v-btn
                  style="float: left"
                  class="secondary-btn"
                  @click="$refs.requestsExcel.$el.click()"
                  >دریافت اکسل</v-btn
                >
                <vue-excel-xlsx
                  v-show="false"
                  ref="requestsExcel"
                  :data="Items"
                  :columns="
                    excelFields.map((x) => {
                      return {
                        label: x.label,
                        field: x.key,
                      };
                    })
                  "
                  :filename="'لیست درخواست ها از ' + dateFrom + ' تا ' + dateTo"
                  :sheetname="currentDate"
                >
                  دریافت اکسل
                </vue-excel-xlsx>
              </v-col>
            </v-row>
            <v-text-field
              v-model="Filter"
              prepend-inner-icon="mdi-magnify"
              label="جستجو"
              single-line
              hide-details
              filled
              rounded
              clearable
              class="text-right w-80 mt-2 mb-2 search-input"
            ></v-text-field>
            <b-table
              responsive
              show-empty
              :fields="Fields"
              :items="Items"
              empty-text="رکوردی برای نمایش وجود ندارد"
              empty-filtered-text="رکوردی برای نمایش وجود ندارد"
              :busy="Busy"
              :filter="Filter"
              :current-page="CurrentPage"
              :per-page="PerPage"
              @filtered="onFiltered"
            >
              <template v-slot:head()="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ data.label }}
                </div>
              </template>
              <template v-slot:cell()="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ data.value }}
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
                    @click="gotoEditService(data.item)"
                    class="text-light mb-2 pa-2 primary-btn"
                    style="width: 100%; margin-top: 2px"
                    ><v-icon> edit</v-icon></v-btn
                  >
                  <v-btn
                    v-if="role == 'reception'"
                    class="secondary-btn pa-2"
                    @click="popup(data.item)"
                    style="width: 100%; margin-top: 2px"
                    ><v-icon>receipt_long</v-icon></v-btn
                  >
                </div>
              </template>
              <template v-slot:cell(visitCost)="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ Number(data.value).toLocaleString() }}
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
            <v-pagination
              v-model="CurrentPage"
              :length="Math.ceil(TotalRows / PerPage)"
              :total-visible="5"
              prev-icon="arrow_back"
              next-icon="arrow_forward"
              style="float: center"
            ></v-pagination>
            <v-select
              label="تعداد در هر صفحه:"
              style="width: 150px"
              v-model="PerPage"
              :items="perPageOptions"
              item-text="text"
              item-value="value"
            ></v-select>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <!-- receipt -->
    <v-card
      class="pa-2"
      style="float: left"
      v-show="false"
      id="Receipt"
      v-if="isMounted"
    >
      <div class="container mb-0" style="border: 2px solid black">
        <div
          class="pa-1"
          style="
            text-align: center;
            margin: auto;
            font-size: 15px;
            border-bottom: 4px solid black;
          "
        >
          <img src="/receiptLogo.png" width="100" height="100" alt="" />
          <br />
          درمانگاه شبانه روزی پارسیان البرز
        </div>

        <p style="direction: rtl; font-weight: 900">
          شماره نوبت: <span style="font-size = 16px">{{ visitNo }}</span>
          <br /><span v-if="doctorName != '-'">{{
            " نام پزشک: دکتر" + doctorName
          }}</span>
          <span v-else> نام پزشک: - </span>
          <br />
          {{ "نام پرستار: " + rcNurseName }}
          <br />
          {{ "نام بیمار: " + patientName }}
          <br />
          {{ "زمان مراجعه: " + reqDate }}
        </p>
        <b-table
          bordered
          v-if="visitType == 'خدمات عمومی'"
          :fields="reqFields"
          :items="userServices"
          small="small"
          responsive
        >
          <template v-slot:head()="data">
            <div style="text-align: center; vertical-align: middle">
              {{ data.label }}
            </div>
          </template>
          <template v-slot:cell(name)="data">
            <div style="text-align: center; vertical-align: middle">
              {{ data.value }}
            </div>
          </template>
          <template v-slot:cell(number)="data">
            <div style="text-align: center; vertical-align: middle">
              {{ data.value }}
            </div>
          </template>
          <template v-slot:cell(cost)="data">
            <div style="text-align: center; vertical-align: middle">
              {{ Number(data.item.cost).toLocaleString() }}
            </div>
          </template>
        </b-table>
        <p v-else style="direction: rtl; font-weight: 900">
          نوع درخواست: {{ visitType }}
        </p>
        <h4 style="float: right">
          {{ "مبلغ کل:" + Number(rcCost).toLocaleString() + "ریال" }}
        </h4>
        <br />
        <hr />
        <br>
      </div>
      <br />
        <h4 style="text-align:center">http://my.parsianalborz.com</h4>        
    </v-card>
    <!-- receipt -->
  </div>
</template>
<script>
import moment from "moment-jalaali";
import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import { mapGetters } from "vuex";
export default {
  components: {
    datePicker: VuePersianDatetimePicker
  },
  data() {
    return {
      // reciept
      userServices: "",
      reception: "",
      visitNo: "",
      reqDate: "",
      rcCost: "",
      patientName: "",
      doctorName: "",
      visitType: "",
      rcNurseName: "",
      reqFields: [
        { key: "name", label: "خدمت" },
        { key: "number", label: "تعداد" },
        { key: "cost", label: "قیمت" },
      ],
      isMounted: false,
      // reciept
      CurrentPage: 1,
      PerPage: 10,
      perPageOptions: [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" },
      ],
      TotalRows: "",
      drName: "",
      nurseName: "",
      Filter: "",
      Busy: true,
      Fields: [
        { key: "index", label: "#" },
        { key: "patientName", label: "نام بیمار" },
        { key: "visitNo", label: "شماره نوبت" },
        { key: "doctorName", label: "پزشک" },
        { key: "nurseName", label: "پرستار" },
        { key: "visitCost", label: "قیمت (ریال)" },
        { key: "receptionName", label: "کارمند پذیرش" },
        { key: "date", label: "تاریخ" },
        { key: "status", label: "وضعیت" },
        { key: "operation", label: "مدیریت" },
      ],
      excelFields: [
        { key: "patientName", label: "نام بیمار" },
        { key: "visitNo", label: "شماره نوبت" },
        { key: "doctorName", label: "پزشک" },
        { key: "nurseName", label: "پرستار" },
        { key: "visitCost", label: "قیمت (ریال)" },
        { key: "receptionName", label: "کارمند پذیرش" },
        { key: "date", label: "تاریخ" },
        { key: "status", label: "وضعیت" },
      ],
      Items: [],
      dateFrom: moment(new Date()).format("jYYYY/jMM/jDD"),
      dateTo: moment(new Date()).format("jYYYY/jMM/jDD"),
      timeFrom: "00:00",
      timeTo: "23:59",
      currentDate: moment(new Date()).format("jYYYY-jMM-jDD"),
      role: "",
      requestId: "",
    };
  },

  methods: {
    gotoNewService() {
      this.$router.push("/reception/newRequest");
    },
    gotoEditService(item) {
      let role = this.role == "reception" ? "reception" : "admin";
      this.$router.push("/" + role + "/editrequest/" + item.id);
    },
    popup(item) {
      this.vLoading = true;
      this.$http
        .post(
          this.baseUrl + "/clinic/visits/print",
          { visitId: item.id },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          this.userServices = res.data.services;
          this.reception = res.data.receptionName;
          this.patientName = res.data.patientName;
          this.doctorName = res.data.doctorName;
          this.rcNurseName = res.data.nurseName;
          this.visitNo = res.data.visitNo;
          this.reqDate = res.data.date;
          this.rcCost = res.data.cost;
          this.visitType = res.data.visitType;
          this.requestId = item.id;
          this.isMounted = true;
          this.vLoading = false;
        })
        .then(() => {
          this.printReceipt();
          this.isMounted = false;
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
          this.vLoading = false;
        });
    },
    printReceipt() {
      //printing receipt
      var myWindow = window.open("#", "Receipt", "height=auto,width=800");
      myWindow.document.write(
        "<html><head><link rel='stylesheet' href='/receipt.css'><title>Receipt</title>"
      );
      myWindow.document.write("</head><body>");
      myWindow.document.write(document.getElementById("Receipt").innerHTML);
      myWindow.document.write("</body></html>");
      myWindow.document.close();

      myWindow.onload = function () {
        myWindow.focus();
        setTimeout(() => {
        myWindow.print();
        myWindow.close();
        }, 500);
      };
    },
    requests() {
      //getting data by sending date and nurse and doc id
      this.Busy = true;
      this.vLoading = true;
      this.$http
        .post(
          this.baseUrl + "/clinic/visits/all",
          {
            startDate: this.dateFrom + this.timeFrom,
            endDate: this.dateTo + this.timeTo,
            docId: this.drName,
            nurseId: this.nurseName,
          },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          this.Busy = false;
          this.vLoading = false;
          if (res.status == 200) {
            this.Items = res.data;
            this.Items.forEach((service) => {
              if (service.status == "لغو") {
                service._rowVariant = "danger";
              }
            });
            this.TotalRows = this.Items.length;
            this.CurrentPage = 1;
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
          this.vLoading = false;
          this.Busy = false;
        });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.TotalRows = filteredItems.length;
      this.CurrentPage = 1;
    },
  },
  computed: {
    ...mapGetters(["drNames", "nurseNames"]),
  },
  mounted() {
    this.role = localStorage.getItem("role");
    if (this.role == "reception") {
      this.dateFrom = moment(new Date())
        .subtract(13, "hour")
        .format("jYYYY/jMM/jDD");
      this.timeFrom = moment(new Date()).subtract(13, "hour").format("HH:mm");
      this.timeTo = moment(new Date()).format("HH:mm");
    }
    this.requests();
  },
};
</script>
