<template>
  <div class="animated fadeIn">
    <v-col cols="12">
        <v-card class="br-card p-3">
          <v-row>
            <v-col v-if="role === 'admin'">
              <v-btn
                style="float: right"
                class="secondary-btn mb-3 mt-2"
                @click="openAddClass()"
                >افزودن کلاس</v-btn
              >
            </v-col>
            <v-col>
              <h4 class="my-2 text-center">لیست کلاس‌ها</h4>
            </v-col>
            <v-col v-if="role === 'admin'">
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
                :data="excelClasses"
                :columns="excelFields"
                filename="لیست دروس"
                :sheetname="currentDate"
              >
                دریافت اکسل
              </vue-excel-xlsx>
            </v-col>
          </v-row>
    <v-text-field v-model="search" dense outlined label="جستوجو" class="mt-3"></v-text-field>

          <b-table
          bordered
          :fields="computedFields"
          :items="Classes"
          :filter="search"
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
          <template v-slot:cell(description)="data">
            <div style="text-align: center; vertical-align: middle">
              {{ data.value ? data.value : '---' }}
            </div>
          </template>
          <template v-slot:cell(teacher)="data">
            <div style="text-align: center; vertical-align: middle">
              {{ data.item.status === 'reserved' ? data.item.teacherId.name : '---' }}
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
              <v-btn
                v-if="data.item.status === 'reserved'"
                color="red"
                class="ms-2 me-2 primary-btn pa-2"
                @click="openFreeClass(data.item)"
                >گرفتن کلاس از استاد</v-btn
              >
            </div>
          </template>
          <template v-slot:cell(profOperation)="data">
            <div
              style="text-align: center; vertical-align: middle"
            >
              <v-btn
                :disabled="data.item.status !== 'open'"
                class="ms-2 me-2 primary-btn pa-2"
                @click="choose(data.item)"
                >{{ data.item.status === 'open' ? 'اخذ کلاس' : 'اخذ شده' }}</v-btn
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
        <v-dialog width="400" v-model="newLessonDialog">
        <v-card>
          <v-card-title>
          <h3>افزودن عنوان درس</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="عنوان درس"
              v-model="newLesson.title"
              :disabled="isBusy"
              outlined
              dense
          ></v-text-field>
          <v-select v-model="newLesson.unit" outlined dense label="تعداد واحد" :items="newLesson"></v-select>
          <v-text-field
              label="توضیحات"
              v-model="newLesson.description"
              :disabled="isBusy"
              outlined
              dense
          ></v-text-field>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          :disabled="!newLesson.title"
          @click="addLesson()"
          >ثبت</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
        <v-dialog width="500" v-model="newClassDialog">
        <v-card>
          <v-card-title>
          <h3>افزودن کلاس</h3>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="8">
              <v-autocomplete 
              label="انتخاب عنوان درس" 
              v-model="newClass.title"
              :items="Lessons" 
              item-text="title"
              item-value="title"
              clearable
              outlined
              :disabled="isBusy" 
              dense></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-btn variant="primary" outlined @click="openAddLesson">افزودن عنوان</v-btn>
            </v-col>
          </v-row>
          <v-select v-model="newClass.day" outlined dense label="روز کلاس" :items="days"></v-select>
          <v-row class="time-row">
              <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                <span id="timeFrom">
                  <v-text-field
                    outlined
                    dense
                    append-icon="schedule"
                    v-model="newClass.startTime"
                    label="از ساعت"
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="newClass.startTime"
                  element="timeFrom"
                  color="#00a7b7"
                  type="time"
                />
              </v-col>
              <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                <span id="timeTo">
                  <v-text-field
                    outlined
                    dense
                    append-icon="schedule"
                    v-model="newClass.endTime"
                    label="تا ساعت"
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="newClass.endTime"
                  element="timeTo"
                  color="#00a7b7"
                  type="time"
                />
              </v-col>
            </v-row>
          <v-radio-group
            v-model="newClass.gender"
            row
          >
            <v-radio
              label="مختلط"
              value="all"
            ></v-radio>
            <v-radio
              label="برادران"
              value="boy"
            ></v-radio>
            <v-radio
              label="خواهران"
              value="girl"
            ></v-radio>
          </v-radio-group>

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
        <v-dialog width="500" v-model="editClassDialog">
        <v-card>
          <v-card-title>
          <h3>ویرایش کلاس</h3>
        </v-card-title>
        <v-card-text>
          <v-card-text>
            <v-row>
              <v-col cols="8">
                <v-autocomplete 
                label="انتخاب عنوان درس" 
                v-model="selectedClass.title"
                :items="Lessons" 
                item-text="title"
                item-value="title"
                clearable
                outlined
                :disabled="isBusy" 
                dense></v-autocomplete>
              </v-col>
              <v-col cols="2">
                <v-btn variant="primary" outlined @click="openAddLesson">افزودن عنوان</v-btn>
              </v-col>
            </v-row>
            <v-select v-model="selectedClass.day" outlined dense label="روز کلاس" :items="days"></v-select>
            <v-row class="time-row">
                <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                  <span id="timeFrom">
                    <v-text-field
                      outlined
                      dense
                      append-icon="schedule"
                      v-model="selectedClass.startTime"
                      label="از ساعت"
                      :editable="true"
                      class="date-input"
                    >
                    </v-text-field>
                  </span>
  
                  <date-picker
                    v-model="selectedClass.startTime"
                    element="timeFrom"
                    color="#00a7b7"
                    type="time"
                  />
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                  <span id="timeTo">
                    <v-text-field
                      outlined
                      dense
                      append-icon="schedule"
                      v-model="selectedClass.endTime"
                      label="تا ساعت"
                      :editable="true"
                      class="date-input"
                    >
                    </v-text-field>
                  </span>
  
                  <date-picker
                    v-model="selectedClass.endTime"
                    element="timeTo"
                    color="#00a7b7"
                    type="time"
                  />
                </v-col>
              </v-row>
            <v-radio-group
              v-model="selectedClass.gender"
              row
            >
              <v-radio
                label="مختلط"
                value="all"
              ></v-radio>
              <v-radio
                label="برادران"
                value="boy"
              ></v-radio>
              <v-radio
                label="خواهران"
                value="girl"
              ></v-radio>
            </v-radio-group>
  
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
        <v-dialog width="400" v-model="freeClassDialog">
          <v-card>
            <v-card-title>
            <h3>حذف استاد</h3>
          </v-card-title>
          <v-card-text>
            <h5 class="text-right">آیا از گرفتن کلاس  {{ selectedClass.title }} از استاد اطمینان دارید؟</h5>
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
import VuePersianDatetimePicker from "vue-persian-datetime-picker";
export default {
  components: {
    datePicker: VuePersianDatetimePicker
  },
  data() {
    return {
      newClass:{title:'',description:''},
      newLesson:{title:'',description:'',unit: 2},
      role: window.localStorage.role,
      selectedClass:{},
      newLessonDialog: false,
      newClassDialog: false,
      removeClassDialog: false,
      editClassDialog: false,
      freeClassDialog: false,
      isBusy: false,
      search:'',
      unitOptions:[1,2,3],
      Classes: [
        // {title:'ریاضی مهندسی',
        // startTime: '10:00',
        // endTime: '12:15',
        // day: 'سه شنبه',
        // gender: 'مختلط',
        // status: 'اخذ شده',
        // teacher: 'رضا بشمنی'
        // },
        // {
        // title:'ریاضی ۱',
        // startTime: '10:00',
        // endTime: '12:15',
        // day: 'یک شنبه',
        // gender: 'مختلط',
        // status: 'اخذ شده',
        // teacher: 'حمید دریلی'
        // },
        // {
        // title:'فیزیک ۱',
        // startTime: '8:00',
        // endTime: '10:15',
        // day: 'چهار شنبه',
        // gender: 'مختلط',
        // status: 'اخذ شده',
        // teacher: 'رامین رستمی'
        // },
        // {
        // title:'آز فیزیک',
        // startTime: '8:00',
        // endTime: '9:30',
        // day: 'سه شنبه',
        // gender: 'مختلط',
        // status: 'اخذ نشده',
        // teacher: '-'
        // },
        // {
        // title:'ورزش ۱',
        // description:' رشته کامپیوتر - روانشناسی - صنایع',
        // startTime: '9:30',
        // endTime: '11:00',
        // day: 'دو شنبه',
        // gender: 'برادران',
        // status: 'اخذ شده',
        // teacher: 'کامران مقدمی'
        // },
        // {
        // title:'دانش خانواده',
        // description:' رشته کامپیوتر - روانشناسی - صنایع',
        // startTime: '9:00',
        // endTime: '10:30',
        // day: 'دو شنبه',
        // gender: 'برادران',
        // status: 'اخذ نشده',
        // teacher: '-'
        // }
      ],
      Lessons: [
      ],
      Fields: [
        { key: "index", label: "#" },
        { key: "title", label: "عنوان درس" },
        { key: "unit", label: "تعداد واحد" },
        { key: "day", label: "روز" },
        { key: "startTime", label: "از شروع" },
        { key: "endTime", label: "تا پایان" },
        { key: "gender", label: "جنسیت" },
        { key: "teacher", label: "استاد" },
        { key: "description", label: "توضیحات" },
        { key: "operation", label: "عملیات" },
      ],
      profFields: [
        { key: "index", label: "#" },
        { key: "title", label: "عنوان درس" },
        { key: "unit", label: "تعداد واحد" },
        { key: "description", label: "توضیحات" },
        { key: "day", label: "روز" },
        { key: "startTime", label: "از شروع" },
        { key: "endTime", label: "تا پایان" },
        { key: "gender", label: "جنسیت" },
        { key: "profOperation", label: "عملیات" },
      ],
      excelFields: [
        { field: "title", label: "عنوان درس" },
        { field: "unit", label: "تعداد واحد" },
        { field: "day", label: "روز" },
        { field: "startTime", label: "از شروع" },
        { field: "endTime", label: "تا پایان" },
        { field: "gender", label: "جنسیت" },
        { field: "status", label: "وضعیت" },
        { field: "teacher", label: "استاد" },
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
      timeFrom: "",
      timeTo: "",
      currentDate: moment(new Date()).format("jYYYY-jMM-jDD")
    };
  },
  mounted(){
    this.getClasses();
    if(this.role === 'admin'){
      this.getLessons();
    }
  },
  computed:{
    computedFields(){
      let fields = this.role === 'admin' ? this.Fields : this.profFields
      return fields
    },
    excelClasses(){
      let exClasses = this.Classes.map(cls=>{
        let day = this.persianDay(cls.day)
        let gender = this.persianGender(cls.gender)
        let teacher = cls.status === 'reserved' ? cls.teacherId.name : '---'
        let status = cls.status === 'reserved' ? 'اخذ شده' : 'خالی'
        return {
          ...cls,
          day,
          gender,
          status,
          teacher
        }
      })
      return exClasses
    }
  },
  methods:{
    persianDay(day){
      let Pday = this.days.filter(d=> d.value === day)[0].text
      return Pday ? Pday : '---'
    },
    persianGender(gender){
      let Pgender = this.genders.filter(g=> g.value === gender)[0].text
      return Pgender ? Pgender : '---'
    },
    getClasses(){
      this.$http
        .get(
          this.baseUrl + `/api/v1/${this.role === 'admin' ? 'admin' : 'user'}/class`,
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
    getLessons(){
      this.$http
        .get(
          this.baseUrl + "/api/v1/admin/lesson",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            if (res.data.response.status == 200) {
              this.Lessons = res.data.response.data
              return this.newClass.title
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
    openAddLesson(){
      this.newLesson = {title:'',description:'',unit: 2}
      this.newLessonDialog = true
    },
    addLesson(){
      this.isBusy = true;
      this.$http
        .post(
          this.baseUrl + "/api/v1/admin/lesson",
          {
            ...this.newLesson
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
              this.newLessonDialog = false;
              this.toast("عنوان با موفقیت اضافه شد", "success");
              this.getLessons();
              this.newClass.title = this.newLesson.title
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
    openAddClass(){
      this.newClass = {
        title:'',
        description:'',
        gender:'all',
        startTime:'',
        endTime:'',
        day:''
    }
      this.newClassDialog = true
    },
    openDeleteClass(clas){
      this.selectedClass = clas
      this.removeClassDialog = true
    },
    openFreeClass(clas){
      this.selectedClass = clas
      this.freeClassDialog = true
    },
    openEditClass(clas){
      this.selectedClass = JSON.parse(JSON.stringify(clas))
      this.editClassDialog = true
    },
    choose(item){
      this.isBusy = true;
      this.$http
        .put(
          this.baseUrl + "/api/v1/user/submitClass/" + item._id,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
              this.toast("کلاس با موفقیت برای شما اخذ شد", "success");
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
    addClass(){
      this.isBusy = true;
      let unit = this.Lessons.filter(lesson => lesson.title === this.newClass.title)[0].unit
      this.$http
        .post(
          this.baseUrl + "/api/v1/admin/class",
          {
            ...this.newClass,
            unit
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
      let unit = this.Lessons.filter(lesson => lesson.title === this.selectedClass.title)[0].unit
      this.$http
        .put(
          this.baseUrl + "/api/v1/admin/class/" + this.selectedClass._id,
          {
            ...this.selectedClass,
            unit
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
    },
    freeClass(){
      this.isBusy = true;
      this.$http
        .put(
          this.baseUrl + "/api/v1/admin/class/unSubmit/Class",
          {
            classId: this.selectedClass._id
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.response.status == 200) {
              this.freeClassDialog = false;
              this.toast("کلاس با موفقیت آزاد شد", "success");
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

