<template>
  <div class="app login-page flex-row align-items-center element">
    <!-- reset pass  -->
    <v-row class="justify-content-center">
      <v-col cols="1">
        &nbsp;
      </v-col>
      <v-col cols="10" sm="10" md="6" lg="5">
        <v-row class="login-row">
          <v-card class="cards pa-5 login-card ">
            <!-- login div -->
            <div v-if="!resetPassDialog" class="login ps-3 pe-3 cards pa-5">
              <h4 class="text-center mb-10 login-text card-h-title">
                برای ورود به سیستم، لطفا نام کاربری و رمز ورود خود را وارد
                نمایید.
              </h4>
              <v-col>
                <v-text-field
                  outlined
                  label="نام کاربری"
                  v-model="username"
                  class="login-input"
                ></v-text-field>
                <v-text-field
                  outlined
                  label="رمز عبور"
                  v-model="password"
                  class="mt-5 login-input"
                  :type="show1 ? 'text' : 'password'"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show1 = !show1"
                  @keyup.enter="password && username ? gotoDashboard() : ''"
                ></v-text-field>
                <!--<v-col cols="8" class="mt-2">-->
                <!-- <a
                  class="primary--text"
                  @click="showResetPass"
                  style=" border: 0; float: left;font-weight:bold;font-size:14px"
                >
                  <i class="icon-login"></i>رمز عبور را فراموش کرده‌اید؟
                </a> -->
              </v-col>

              <!--</v-col>-->
              <v-row class="mt-5">
                <v-col class="text-center">
                  <v-btn
                    :loading="busy"
                    type="submit"
                    class="primary-btn w-100 pa-5"
                    @click="gotoDashboard()"
                    :disabled="busy || !(password && username)"
                    style="border: 0"
                  >
                    <span class="h3">
                      ورود
                    </span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <!-- reset pass div -->
            <div v-else class="login ps-3 pe-3 cards pa-5">
              <h4 class="text-center mb-10 login-text card-h-title">
                بازیابی رمز
              </h4>
              <v-card-text class="pa-0">
                <v-container>
                  <v-row class="justify-content-center ">
                    <v-col>
                      <!-- NOTE here, the user will enter the mobile num  -->
                      <div v-if="!codeSent">
                        <h5
                          class="text-center mb-10 login-text"
                          style="font-size:16px"
                        >
                          برای بازیابی رمز عبور شماره همراه خود را وارد کنید
                        </h5>
                        <v-text-field
                          @keyup.enter.native="
                            !isBusy && mobile ? sendCode : ''
                          "
                          outlined
                          dense
                          type="number"
                          label="شماره تلفن همراه"
                          v-model="mobile"
                          class="w-100"
                        ></v-text-field>
                      </div>
                      <!-- NOTE then after the activation code has been sent, here, the user will enter 
            the activation and the new pass -->
                      <div v-else>
                        <h5 class="text-center mb-10 login-text">
                          لطفا کدی را که اکنون به شما پیامک کردیم را به همراه
                          رمز عبور جدید وارد نمایید
                        </h5>
                        <v-text-field
                          type="number"
                          label="کد ارسالی"
                          outlined
                          dense
                          v-model="activationCode"
                        ></v-text-field>
                        <v-text-field
                          label="رمز عبور جدید"
                          outlined
                          dense
                          v-model="newPass"
                          class="my-3"
                          :type="show2 ? 'text' : 'password'"
                          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="show2 = !show2"
                        ></v-text-field>
                        <v-text-field
                          label="تکرار رمز عبور جدید"
                          outlined
                          dense
                          v-model="repeatNewPass"
                          :type="show3 ? 'text' : 'password'"
                          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="show3 = !show3"
                          @keyup.enter="
                            newPass &&
                            repeatNewPass &&
                            activationCode &&
                            !isBusy
                              ? resetPass()
                              : ''
                          "
                        ></v-text-field>
                        <v-row class="mt-2 ">
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                            lg="6"
                            class="center-row"
                          >
                            <v-btn
                              type="submit"
                              class="primary-btn pa-6"
                              @click="resetPass()"
                              style="border: 0;width:18rem"
                              :disabled="
                                isBusy ||
                                  !(repeatNewPass && newPass && activationCode)
                              "
                            >
                              <span class="h5 mt-2">
                                تغییر رمز
                              </span> </v-btn
                            >&nbsp;
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                            lg="6"
                            class="center-row"
                          >
                            <!-- NOTE (b-sendAgain) to get the activation code again -->
                            <v-btn
                              type="submit"
                              class="primary-btn pa-6"
                              @click="sendCode()"
                              style="border: 0;width:18rem"
                              :disabled="sendAgainDisbaled"
                              ><span class="h5 mt-2">
                                ارسال مجدد کد

                                <span v-if="countdown != 0">{{
                                  toHHMMSS(countdown)
                                }}</span>
                              </span>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <!--<v-card-actions>-->
              <v-row class="mx-auto">
                <v-col
                  style="display: flex; justify-content: center; align-items: center;"
                  :cols="codeSent ? '6' : ''"
                  v-if="!codeSent"
                >
                  <v-btn
                    @click="sendCode()"
                    outlined
                    class=" primary-btn pa-6"
                    :disabled="isBusy || !mobile"
                    
                    style="width:18rem"
                  >
                    <span class="h5 mt-2">
                      ارسال کد
                    </span>
                  </v-btn></v-col
                >
                <v-col
                :cols="codeSent ? '12' : '6'"
                :class="codeSent ? 'mt-4' : ''"
                  style="display: flex;justify-content: center;align-items: center;"
                >
                  <v-btn
                    style="width:18rem;margin:auto"
                    class="secondary-btn  pa-6"
                    outlined
                    @click="closeResetPass()"
                  >
                    <span class="h5 mt-2">بازگشت</span>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class=""> </v-row>
              <!--</v-card-actions>-->
            </div>
          </v-card>
        </v-row>
      </v-col>

      <v-col></v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import md5 from "js-md5";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      mobile: "",
      password: "",
      busy: false,
      isBusy: false,
      codeSent: false,
      activationCode: "",
      newPass: "",
      repeatNewPass: "",
      countdown: 60,
      resetPassDialog: false,
      show1: false,
      show2: false,
      show3: false,
    };
  },
  computed: {},
  methods: {
    ...mapMutations(["setUserName", "setRole"]),
    gotoDashboard() {
      // showing dash by sending our user and pass then with checking our information by server info we get our dash
      this.busy = true;
      this.$http
        .post(this.baseUrl + "/api/v1/auth/login", {
          mobile: Number(this.username),
          password: this.password,
        })
        .then(res => {
          this.busy = false;
          console.log('res is: ',res.data.response)
          if (res.status == 200) {
            localStorage.clear();
            localStorage.setItem("token", res.data.response.data.token);
            localStorage.setItem("role", res.data.response.data.role === 'admin' ? 'admin' : 'prof');
            let role = res.data.response.data.role === 'admin' ? 'admin' : 'prof';
            this.setUserName(res.data.response.data.name);
            this.setRole(role);
              this.$router.push(`/${role}/dashboard`);
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch(err => {
          this.busy = false;
          this.toast("خطا: " + err.response.message, "error");
        });
    },
    showResetPass() {
      // this.$refs["resetPassModal"].show();
      this.resetPassDialog = true;
      this.codeSent = false;
      this.mobile = "";
      this.activationCode = "";
      this.newPass = "";
      this.repeatNewPass = "";
    },
    closeResetPass() {
      // this.$refs["resetPassModal"].hide();
      this.mobile = "";
      this.activationCode = "";
      this.newPass = "";
      this.repeatNewPass = "";
      this.codeSent = false;
      this.resetPassDialog = false;
    },
    sendCode() {
      // NOTE (m-sendCode) to send the code
      this.codeSent = false;
      this.isBusy = true;
      this.$http
        .post(this.baseUrl + "/clinic/auth/adminsActivationcode", {
          mobile: this.mobile
        })
        .then(res => {
          this.codeSent = true;
          this.isBusy = false;
        })
        .catch(err => {
          this.toast("خطا: " + err.response.data, "error");
          this.isBusy = false;
        });
    },
    resetPass() {
      // if our newpass characters was more than 5 and new pass was equal to repeat pass reset pass
      if (this.newPass.length > 5) {
        if (this.newPass == this.repeatNewPass) {
          this.isBusy = true;
          this.$http
            .post(this.baseUrl + "/clinic/auth/adminsRecover", {
              mobile: this.mobile,
              password: md5(this.newPass),
              activationcode: this.activationCode
            })
            .then(res => {
              this.toast("رمز عبور شما با موفقیت تغییر کرد", "success");
              this.isBusy = false;
              this.closeResetPass();
            })
            .catch(err => {
              this.toast("خطا: " + err.response.data, "error");
              this.isBusy = false;
            });
        } else {
          this.toast("رمز عبور و تکرار آن باید منطبق باشند", "error");
        }
      } else {
        this.toast("رمز عبور باید بیشتر از ۵ نویسه داشته باشد", "error");
      }
    },
    toHHMMSS(value) {
      // NOTE (m-toHHMMSS) determine the order of hours, minutes and seconds
      var sec_num = parseInt(value, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return minutes + ":" + seconds;
    },
    countDownTimer() {
      //NOTE (m-countDownTimer) to start counting down after 1 second
      if (this.countdown > 0) {
        setTimeout(() => {
          this.countdown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    }
  },
  watch: {
    codeSent: function(val, oldVal) {
      // NOTE (w-codeSent) to give the code again after 60 second
      this.countdown = 60;

      if (val == true) {
        this.sendAgainDisbaled = true;
        this.countDownTimer();
      }
    },
    countdown: function(val, oldVal) {
      // NOTE (w-countdown) to countdown for sending code again
      if (val == 0) {
        this.sendAgainDisbaled = false;
      } else {
        this.sendAgainDisbaled = true;
      }
    }
  },
};
</script>
<style scoped></style>
<style lang="scss" scoped></style>
