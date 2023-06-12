<template>
  <div class="animated fadeIn">
    <v-col cols="12">
        <v-card class="br-card p-3">
          <v-row>
      <v-col>
        <v-btn
          style="float: right"
          class="secondary-btn mb-3 mt-2"
          @click="openAddLesson()"
          >افزودن درس</v-btn
        >
      </v-col>
      <v-col>
      </v-col>
    </v-row>
    <v-text-field v-model="search" dense outlined label="جستوجو"></v-text-field>
          <b-table
          bordered
          :fields="Fields"
          :items="Lessons"
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
          <template v-slot:cell(operation)="data">
            <div
              style="text-align: center; vertical-align: middle"
            >
              <v-btn
                class="ms-2 me-2 primary-btn pa-2"
                @click="openDeleteLesson(data.item)"
                >حذف</v-btn
              >
              <v-btn
                class="ms-2 me-2 primary-btn pa-2"
                @click="openEditLesson(data.item)"
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
        <v-dialog width="400" v-model="editLessonDialog">
        <v-card>
          <v-card-title>
          <h3>ویرایش عنوان درس</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="عنوان درس"
              v-model="selectedLesson.title"
              :disabled="isBusy"
              outlined
              dense
          ></v-text-field>
          <v-text-field
              label="توضیحات"
              v-model="selectedLesson.description"
              :disabled="isBusy"
              outlined
              dense
          ></v-text-field>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          :disabled="!selectedLesson.title"
          @click="editLesson()"
          >ویراریش</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
        <v-dialog width="400" v-model="removeLessonDialog">
        <v-card>
          <v-card-title>
          <h3>حذف عنوان درسی</h3>
        </v-card-title>
        <v-card-text>
          <h5 class="text-right">آیا از حذف درس {{ selectedLesson.title }} اطمینان دارید؟</h5>
          <v-btn
          class="secondary-btn"
          :loading="isBusy"
          @click="removeLesson()"
          >حذف</v-btn
        >
        </v-card-text>

        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>
<script>
export default {

  data() {
    return {
      newLesson:{title:'',description:''},
      selectedLesson:{},
      newLessonDialog: false,
      removeLessonDialog: false,
      editLessonDialog: false,
      isBusy: false,
      Lessons: [],
      search: '',
      Fields: [
        { key: "index", label: "#" },
        { key: "title", label: "عنوان درس" },
        { key: "operation", label: "عملیات" },
      ],
    };
  },
  mounted(){
    this.getLessons();
  },
  methods:{
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
      this.newLesson = {title:'',description:''}
      this.newLessonDialog = true
    },
    openDeleteLesson(prof){
      this.selectedLesson = prof
      this.removeLessonDialog = true
    },
    openEditLesson(prof){
      this.selectedLesson = JSON.parse(JSON.stringify(prof))
      this.editLessonDialog = true
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
    editLesson(){
      this.isBusy = true;
      this.$http
        .put(
          this.baseUrl + "/api/v1/admin/lesson/" + this.selectedLesson._id,
          {
            ...this.selectedLesson
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.response.status == 200) {
              this.editLessonDialog = false;
              this.toast("عنوان با موفقیت ویرایش شد", "success");
              this.getLessons();
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
    removeLesson(){
      this.isBusy = true;
      this.$http
        .delete(
          this.baseUrl + "/api/v1/admin/lesson/" + this.selectedLesson._id,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.response.status == 200) {
              this.removeLessonDialog = false;
              this.toast("عنوان مورد نظر حذف شد", "success");
              this.getLessons();
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

