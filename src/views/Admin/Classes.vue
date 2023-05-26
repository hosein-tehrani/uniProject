<template>
  <div class="animated fadeIn">
    <v-col cols="12">
        <v-card class="br-card p-3">
          <v-row>
      <v-col>
        <v-btn
          style="float: right"
          class="secondary-btn mb-3 mt-2"
          @click="openAddClass()"
          >افزودن کلاس</v-btn
        >
      </v-col>
      <v-col>
        <v-btn
          style="float: left"
          class="secondary-btn mb-3 mt-2"
          :disabled="Classes.length==0"
          @click="$refs.renderedExcel.$el.click()"
          >دریافت اکسل</v-btn
        >
        <vue-excel-xlsx
          v-show="false"
          ref="renderedExcel"
          :data="Classes"
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
          :items="Classes"
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
                @click="openDeleteClass(data.item)"
                >حذف</v-btn
              >
              <v-btn
                class="ms-2 me-2 primary-btn pa-2"
                @click="openEditClass(data.item)"
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
        <v-dialog width="400" v-model="newClassDialog">
        <v-card>
          <v-card-title>
          <h3>افزودن کلاس</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="کلاس"
              v-model="newClass.title"
              :disabled="isBusy"
              outlined
              dense
          ></v-text-field>
          <v-text-field
              label="توضیحات"
              v-model="newClass.description"
              :disabled="isBusy"
              outlined
              dense
          ></v-text-field>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          :disabled="!newClass.title"
          @click="addClass()"
          >ثبت</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
        <v-dialog width="400" v-model="editClassDialog">
        <v-card>
          <v-card-title>
          <h3>ویرایش کلاس</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="عنوان درس"
              v-model="selectedClass.title"
              :disabled="isBusy"
              outlined
              dense
          ></v-text-field>
          <v-text-field
              label="توضیحات"
              v-model="selectedClass.description"
              :disabled="isBusy"
              outlined
              dense
          ></v-text-field>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          :disabled="!selectedClass.title"
          @click="editClass()"
          >ویراریش</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
        <v-dialog width="400" v-model="removeClassDialog">
        <v-card>
          <v-card-title>
          <h3>حذف کلاس</h3>
        </v-card-title>
        <v-card-text>
          <h5 class="text-right">آیا از حذف کلاس {{ selectedClass.title }} اطمینان دارید؟</h5>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          @click="removeClass()"
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
export default {
  data() {
    return {
      newClass:{title:'',description:''},
      selectedClass:{},
      newClassDialog: false,
      removeClassDialog: false,
      editClassDialog: false,
      isBusy: false,
      Classes: [],
      Fields: [
        { key: "index", label: "#" },
        { key: "title", label: "عنوان درس" },
        { key: "description", label: "توضیحات" },
        { key: "operation", label: "عملیات" },
      ],
      excelFields: [
        { key: "name", label: "نام و نام خانوادگی" },
        { key: "mobile", label: "تلفن همراه" },
        { key: "email", label: "ایمیل" }
      ],
      currentDate: moment(new Date()).format("jYYYY-jMM-jDD")
    };
  },
  mounted(){
    this.getClasses();
  },
  methods:{
    getClasses(){
      this.$http
        .get(
          this.baseUrl + "/api/v1/admin/class",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            if (res.data.response.status == 200) {
              this.Classes = res.data.response.data
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
    openAddClass(){
      this.newClass = {title:'',description:''}
      this.newClassDialog = true
    },
    openDeleteClass(prof){
      this.selectedClass = prof
      this.removeClassDialog = true
    },
    openEditClass(prof){
      this.selectedClass = JSON.parse(JSON.stringify(prof))
      this.editClassDialog = true
    },
    addClass(){
      this.isBusy = true;
      this.$http
        .post(
          this.baseUrl + "/api/v1/admin/class",
          {
            ...this.newClass
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
              this.newClassDialog = false;
              this.toast("کلاس با موفقیت اضافه شد", "success");
              this.getClasses();
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
    editClass(){
      this.isBusy = true;
      this.$http
        .put(
          this.baseUrl + "/api/v1/admin/class/" + this.selectedClass._id,
          {
            ...this.selectedClass
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.response.status == 200) {
              this.editClassDialog = false;
              this.toast("کلاس با موفقیت ویرایش شد", "success");
              this.getClasses();
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
    removeClass(){
      this.isBusy = true;
      this.$http
        .delete(
          this.baseUrl + "/api/v1/admin/class/" + this.selectedClass._id,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.response.status == 200) {
              this.removeClassDialog = false;
              this.toast("کلاس مورد نظر حذف شد", "success");
              this.getClasses();
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

