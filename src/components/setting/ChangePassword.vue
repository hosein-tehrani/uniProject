<template>
  <div class="animated fadeIn">
    <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="m-auto">
      <v-card-title style="background-color: transparent !important;justify-content:center">
        <h3>
        تغییر رمز عبور        
        </h3>
      </v-card-title>
      <v-card class="cards pa-3">
        <v-card-text>
          <div>
            <v-text-field
              outlined
              dense
              :type="show1 ? 'text' : 'password'"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show1 = !show1"
              label="رمز عبور فعلی"
              v-model="oldPassword"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              :type="show2 ? 'text' : 'password'"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show2 = !show2"
              label="رمز عبور جدید"
              v-model="newPassword"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              :type="show3 ? 'text' : 'password'"
              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show3 = !show3"
              label="تکرار رمز عبور"
              v-model="repeatPassword"
              @keyup.enter="
                oldPassword && newPassword && repeatPassword && !Busy
                  ? changePassord()
                  : ''
              "
            ></v-text-field>
            <v-btn
              :disabled="!oldPassword || !newPassword || !repeatPassword"
              :loading="Busy"
              class="submit-btn primary-btn w-100"
              @click="changePassord"
            >
              ثبت</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  
  data() {
    return {
      Busy: false,
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
      show1: false,
      show2: false,
      show3: false,
      role: window.localStorage.role,
    };
  },

  methods: {
    changePassord() {
      if (this.newPassword == this.repeatPassword) {
        //first check if our new pass was same as repeat password
        this.Busy = true;
        let url = this.role === 'admin' ? '/api/v1/admin/changePassword' : '/api/v1/user/changePassword'
        this.$http
          .put(
            this.baseUrl + url,
            {
              //then we send old pass and new pass to server address that we've set before
              oldPass: this.oldPassword,
              newPass: this.newPassword
            },
            {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
          )
          .then(res => {
            // if our respon was ok notify the success
            if (res.status == 200) {
              this.toast('رمز عبور شما با موفقیت ویرایش شد', "success");
              //then set old pass and new and reapet pass to empty in data
              this.oldPassword = "";
              this.newPassword = "";
              this.repeatPassword = "";
            } else {
              this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
            }
            this.Busy = false;
            // busy avtive and disable the button
          })
          .catch(err => {
            console.log(err.response.data.response.message)
            this.toast("خطا: " + err.response.data.response.message, "error");
            this.Busy = false;
          });
      } else {
        this.toast("خطا: رمز عبور جدید با تکرار آن مطابقت ندارد.", "error");
      }
    }
  }
};
</script>
