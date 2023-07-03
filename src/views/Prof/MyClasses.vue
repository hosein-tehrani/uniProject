<template>
    <div class="animated fadeIn">
      <v-col cols="12">
          <v-card class="br-card p-3">
            <v-row class="my-2">
              <v-col>
                  <h4>کلاس های من</h4>
              </v-col>
              <v-col>
                <v-btn
                  style="float: left"
                  class="secondary-btn mb-3 mt-2"
                  :disabled="classes.length==0"
                  @click="$refs.renderedExcel.$el.click()"
                  >دریافت اکسل</v-btn
                >
                <vue-excel-xlsx
                  v-show="false"
                  ref="renderedExcel"
                  :data="excelClasses"
                  :columns="excelFields"
                  filename="لیست دروس"
                  :sheetname="currentDate"
                >
                  دریافت اکسل
                </vue-excel-xlsx>
              </v-col>
            </v-row>
            
            <v-text-field v-model="search" dense outlined label="جستوجو"></v-text-field>
            <b-table
            bordered
            :fields="Fields"
            :items="classes"
            :filter='search'
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
            <template v-slot:cell(day)="data">
            <div style="text-align: center; vertical-align: middle">
              {{ persianDay(data.value) }}
            </div>
          </template>
          <template v-slot:cell(gender)="data">
            <div style="text-align: center; vertical-align: middle">
              {{ persianGender(data.value) }}
            </div>
          </template>
            <template v-slot:cell(index)="data">
              <div
                style="text-align: center; vertical-align: middle"
              >
                {{ data.index + 1 }}
              </div>
            </template>
            <template v-slot:cell(operation)="data">
              <div
                style="text-align: center; vertical-align: middle"
              >
  
                <v-btn
                  color="red"
                  class="ms-2 me-2 primary-btn pa-2"
                  @click="openFreeClass(data.item)"
                  >حذف کلاس</v-btn
                >
              </div>
            </template>
          </b-table>
          </v-card>
          <v-dialog width="400" v-model="freeClassDialog">
            <v-card>
              <v-card-title>
              <h3>حذف کلاس</h3>
              </v-card-title>
              <v-card-text>
                  <h5 class="text-right">آیا از حذف کلاس  {{ selectedClass.title }} اطمینان دارید؟</h5>
                  <v-btn
                  class="secondary-btn"
                  :loading="isBusy"
                  @click="freeClass()"
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
        isBusy: false,
        classes: [],
        search: '',
        freeClassDialog: false,
        Fields: [
          { key: "index", label: "#" },
          { key: "title", label: "عنوان درس" },
          { key: "unit", label: "تعداد واحد" },
          { key: "day", label: "روز" },
          { key: "startTime", label: "از شروع" },
          { key: "endTime", label: "تا پایان" },
          { key: "gender", label: "جنسیت" },
          { key: "description", label: "توضیحات" },
          { key: "operation", label: "عملیات" },
        ],      
        excelFields: [
        { field: "title", label: "عنوان درس" },
        { field: "unit", label: "تعداد واحد" },
        { field: "day", label: "روز" },
        { field: "startTime", label: "از شروع" },
        { field: "endTime", label: "تا پایان" },
        { field: "gender", label: "جنسیت" },
        { field: "description", label: "توضیحات" },
      ],
        days:[
        {text:'شنبه',value:'Saturday'},
        {text:'یکشنبه',value:'Sunday'},
        {text:'دوشنبه',value:'Monday'},
        {text:'سه شنبه',value:'Tuesday'},
        {text:'چهارشنبه',value:'Wednesday'},
        {text:'پنج شنبه',value:'Thursday'},
        {text:'جمعه',value:'Friday'},
      ],
      genders:[
        {text:'برادران',value:'boy'},
        {text:'خواهران',value:'girl'},
        {text:'مختلط',value:'all'}
      ],
      currentDate: moment(new Date()).format("jYYYY-jMM-jDD"),
      selectedClass: {}
      };
    },
    computed:{
    excelClasses(){
      let exClasses = this.classes.map(cls=>{
        let day = this.persianDay(cls.day)
        let gender = this.persianGender(cls.gender)
        return {
          ...cls,
          day,
          gender
        }
      })
      return exClasses
    }
  },
    mounted(){
      this.getMyClasses();
    },
    methods:{
      openFreeClass(clas){
        this.selectedClass = clas
        this.freeClassDialog = true
      },
      freeClass(){
        this.isBusy = true;
        this.$http
          .put(
            this.baseUrl + "/api/v1/user/unSubmitClass/" + this.selectedClass._id,
            {},
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            if (res.data.response.status == 200) {
                this.freeClassDialog = false;
                this.toast("کلاس با موفقیت حذف شد", "success");
                this.getMyClasses();
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
      getMyClasses(){
        this.$http
          .get(
            this.baseUrl + "/api/v1/user/myClass/",
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              if (res.data.response.status == 200) {
                this.classes = res.data.response.data
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
      persianDay(day){
        let Pday = this.days.filter(d=> d.value === day)[0].text
        return Pday ? Pday : '---'
        },
        persianGender(gender){
        let Pgender = this.genders.filter(g=> g.value === gender)[0].text
        return Pgender ? Pgender : '---'
        },
    }
  };
  </script>
  
  