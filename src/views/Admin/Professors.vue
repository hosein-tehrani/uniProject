<template>
  <div class="animated fadeIn">
    <v-col cols="12">
        <v-card class="br-card p-3">
          <v-row>
            <v-col>
            </v-col>
            <v-col>
              <h4 class="my-2 text-center">لیست اساتید و مدیر گروه‌ها</h4>
            </v-col>
            <v-col>
            </v-col>
          </v-row>
          <v-tabs
            fixed-tabs
            v-model="tab"
          >
            <v-tabs-slider color="blue"></v-tabs-slider>
            <v-tab block><h4>اساتید</h4></v-tab>
            <v-tab @click="getAdmins"><h4>مدیرگروه‌ها</h4></v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card elevation="2" class="p-1">
                <v-row>
                  <v-col>
                    <v-btn
                      style="float: right"
                      class="secondary-btn mb-3 mt-2"
                      @click="openAddProf()"
                      >افزودن استاد</v-btn
                    >        
                  </v-col>
                  <v-col>
                    <v-btn
                      style="float: left"
                      class="secondary-btn mb-3 mt-2"
                      :disabled="profs.length==0"
                      @click="$refs.renderedExcel.$el.click()"
                      >دریافت اکسل</v-btn
                    >
                    <vue-excel-xlsx
                      v-show="false"
                      ref="renderedExcel"
                      :data="profs"
                      :columns="excelFields"
                      filename="لیست اساتید"
                      :sheetname="currentDate"
                    >
                      دریافت اکسل
                    </vue-excel-xlsx>
                  </v-col>
                </v-row>
                <b-table
                bordered
                :fields="Fields"
                :items="profs"
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
                <template v-slot:cell(operation)="data">
                  <div
                    style="text-align: center; vertical-align: middle"
                  >
                    <v-btn
                      class="ms-2 me-2 primary-btn pa-2"
                      @click="openDeleteProf(data.item)"
                      >حذف</v-btn
                    >
                    <v-btn
                      class="ms-2 me-2 primary-btn pa-2"
                      @click="openEditProf(data.item)"
                      >ویرایش</v-btn
                    >
                  </div>
                </template>
                <template v-slot:cell(index)="data">
                  <div
                    style="text-align: center; vertical-align: middle"
                  >
                    {{ data.index + 1 }}
                  </div>
                </template>
                </b-table>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card elevation="2" class="p-1">
                <v-row>
                  <v-col>
                    <v-btn
                      style="float: right"
                      class="secondary-btn mb-3 mt-2 mx-3"
                      @click="openAddAdmin()"
                      >افزودن مدیرگروه</v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn
                      style="float: left"
                      class="secondary-btn mb-3 mt-2"
                      :disabled="admins.length==0"
                      @click="$refs.adminRenderedExcel.$el.click()"
                      >دریافت اکسل</v-btn
                    >
                    <vue-excel-xlsx
                      v-show="false"
                      ref="adminRenderedExcel"
                      :data="admins"
                      :columns="excelFields"
                      filename="لیست مدیران گروه‌ها"
                      :sheetname="currentDate"
                    >
                      دریافت اکسل
                    </vue-excel-xlsx>
                  </v-col>
                </v-row>
                <b-table
                bordered
                :fields="adminFields"
                :items="admins"
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
                <template v-slot:cell(operation)="data">
                  <div
                    style="text-align: center; vertical-align: middle"
                  >
                    <v-btn
                      class="ms-2 me-2 primary-btn pa-2"
                      @click="openDeleteProf(data.item)"
                      >حذف</v-btn
                    >
                    <v-btn
                      class="ms-2 me-2 primary-btn pa-2"
                      @click="openEditProf(data.item)"
                      >ویرایش</v-btn
                    >
                  </div>
                </template>
                <template v-slot:cell(index)="data">
                  <div
                    style="text-align: center; vertical-align: middle"
                  >
                    {{ data.index + 1 }}
                  </div>
                </template>
                </b-table>              
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
        <v-dialog width="400" v-model="newAdminDialog">
        <v-card>
          <v-card-title>
          <h3>افزودن ادمین</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
                    label="نام و نام خانوادگی"
                    v-model="newAdmin.name"
                    :disabled="isBusy"
                    outlined
                    dense
          ></v-text-field>
          <v-text-field
            label="شماره همراه"
            v-model="newAdmin.mobile"
            :disabled="isBusy"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            label="پست الکترونیک"
            v-model="newAdmin.email"
            :disabled="isBusy"
            type="email"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            label="رمز عبور"
            v-model="newAdmin.password"
            :disabled="isBusy"
            type="password"
            outlined
            dense
          ></v-text-field>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          :disabled="!newAdmin.mobile || !newAdmin.name || !newAdmin.password"
          @click="addAdmin()"
          >ثبت</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
        <v-dialog width="400" v-model="newProfDialog">
        <v-card>
          <v-card-title>
          <h3>افزودن استاد</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
                    label="نام و نام خانوادگی"
                    v-model="newProf.name"
                    :disabled="isBusy"
                    outlined
                    dense
          ></v-text-field>
          <v-text-field
            label="شماره همراه"
            v-model="newProf.mobile"
            :disabled="isBusy"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            label="پست الکترونیک"
            v-model="newProf.email"
            :disabled="isBusy"
            type="email"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            label="رمز عبور"
            v-model="newProf.password"
            :disabled="isBusy"
            type="password"
            outlined
            dense
          ></v-text-field>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          :disabled="!newProf.mobile || !newProf.name || !newProf.password"
          @click="addProf()"
          >ثبت</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
        <v-dialog width="400" v-model="editProfDialog">
        <v-card>
          <v-card-title>
          <h3>ویرایش استاد</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
                    label="نام و نام خانوادگی"
                    v-model="selectedProf.name"
                    :disabled="isBusy"
                    outlined
                    dense
          ></v-text-field>
          <v-text-field
            label="شماره همراه"
            v-model="selectedProf.mobile"
            :disabled="isBusy"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            label="پست الکترونیک"
            v-model="selectedProf.email"
            :disabled="isBusy"
            type="email"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            label="رمز عبور"
            v-model="selectedProf.newPassword"
            :disabled="isBusy"
            type="password"
            outlined
            dense
          ></v-text-field>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          :disabled="!selectedProf.mobile || !selectedProf.name"
          @click="editProf()"
          >ویراریش</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
        <v-dialog width="400" v-model="removeProfDialog">
        <v-card>
          <v-card-title>
          <h3>حذف استاد</h3>
        </v-card-title>
        <v-card-text>
          <h5 class="text-right">آیا از حذف استاد {{ selectedProf.name }} اطمینان دارید؟</h5>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          @click="removeProf()"
          >حذف</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>
<script>
import moment from "moment-jalaali";
import md5 from "js-md5";
export default {

  data() {
    return {
      newProf:{name:'',mobile:'',password:'',email: ''},
      newAdmin:{name:'',mobile:'',password:'',email: ''},
      selectedProf:{},
      newProfDialog: false,
      newAdminDialog: false,
      removeProfDialog: false,
      editProfDialog: false,
      isBusy: false,
      profs: [],
      admins: [],
      tab: 0,
      Fields: [
        { key: "index", label: "#" },
        { key: "name", label: "نام و نام خانوادگی" },
        { key: "mobile", label: "تلفن همراه" },
        { key: "email", label: "ایمیل" },
        { key: "operation", label: "عملیات" },
      ],
      adminFields: [
        { key: "index", label: "#" },
        { key: "name", label: "نام و نام خانوادگی" },
        { key: "mobile", label: "تلفن همراه" },
        { key: "email", label: "ایمیل" }
      ],
      excelFields: [
        { field: "name", label: "نام و نام خانوادگی" },
        { field: "mobile", label: "تلفن همراه" },
        { field: "email", label: "ایمیل" }
      ],
      currentDate: moment(new Date()).format("jYYYY-jMM-jDD")
    };
  },
  mounted(){
    this.getProfs();
  },
  methods:{
    getProfs(){
      this.$http
        .get(
          this.baseUrl + "/api/v1/admin/user",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            if (res.data.response.status == 200) {
              this.profs = res.data.response.data
            } else {
              this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
            }
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch((err) => {
          this.toast(err, "error");
        });
    },
    getAdmins(){
      this.$http
        .get(
          this.baseUrl + "/api/v1/admin/adminList",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
              this.admins = res.data.response.data
              this.tab=1;
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch((err) => {
          this.toast(err, "error");
        });
    },
    openAddProf(){
      this.newProf = {name:'',mobile:'',password:'',email: ''}
      this.newProfDialog = true
    },
    openAddAdmin(){
      this.newAdmin = {name:'',mobile:'',password:'',email: ''}
      this.newAdminDialog = true
    },
    openDeleteProf(prof){
      this.selectedProf = prof
      this.removeProfDialog = true
    },
    openEditProf(prof){
      this.selectedProf = JSON.parse(JSON.stringify(prof))
      this.editProfDialog = true
    },
    addProf(){
      this.isBusy = true;
      this.$http
        .post(
          this.baseUrl + "/api/v1/admin/user",
          {
            ...this.newProf,
            password: md5(this.newProf.password)
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
              this.newProfDialog = false;
              this.toast("استاد با موفقیت اضافه شد", "success");
              this.getProfs();
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
          this.isBusy = false;
        })
        .catch((err) => {
          this.toast(err, "error");
          this.isBusy = false;
        });
    },
    addAdmin(){
      this.isBusy = true;
      this.$http
        .post(
          this.baseUrl + "/api/v1/admin/addAdmin",
          {
            ...this.newAdmin,
            password: md5(this.newAdmin.password)
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
              this.newAdminDialog = false;
              this.toast("مدیرگروه با موفقیت اضافه شد", "success");
              this.getAdmins();
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
          this.isBusy = false;
        })
        .catch((err) => {
          this.toast(err, "error");
          this.isBusy = false;
        });
    },
    editProf(){
      this.isBusy = true;
      this.$http
        .put(
          this.baseUrl + "/api/v1/admin/user/" + this.selectedProf._id,
          {
            ...this.selectedProf,
            password: this.selectedProf.newPassword
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.response.status == 200) {
              this.editProfDialog = false;
              this.toast("استاد با موفقیت ویرایش شد", "success");
              this.getProfs();
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
          this.isBusy = false;
        })
        .catch((err) => {
          this.toast(err, "error");
          this.isBusy = false;
        });
    },
    removeProf(){
      this.isBusy = true;
      this.$http
        .delete(
          this.baseUrl + "/api/v1/admin/user/" + this.selectedProf._id,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.response.status == 200) {
              this.removeProfDialog = false;
              this.toast("استاد مورد نظر حذف شد", "success");
              this.getProfs();
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
          this.isBusy = false;
        })
        .catch((err) => {
          this.toast(err, "error");
          this.isBusy = false;
        });
    }
  }
};
</script>

