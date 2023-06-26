<template>
    <div class="animated fadeIn">
      <v-col cols="12">
          <v-card class="br-card p-3">
            <v-row>
        <v-col>
            <h4>کلاس های من</h4>
        </v-col>
        <v-col>
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
          </b-table>
          </v-card>
      </v-col>
    </div>
  </template>
  <script>
  export default {
  
    data() {
      return {
        isBusy: false,
        classes: [],
        search: '',
        Fields: [
          { key: "index", label: "#" },
          { key: "title", label: "عنوان درس" },
          { key: "day", label: "روز" },
          { key: "startTime", label: "از شروع" },
          { key: "endTime", label: "تا پایان" },
          { key: "gender", label: "جنسیت" },
          { key: "description", label: "توضیحات" },
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
      };
    },
    mounted(){
      this.getMyClasses();
    },
    methods:{
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
  
  