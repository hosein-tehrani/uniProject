<template>
  <div class="app login-page flex-row align-items-center element">
    <v-row class="justify-content-center">
      <v-col cols="1" sm="1" md="4" lg="4"> &nbsp; </v-col>
      <v-col cols="10" sm="10" md="4" lg="4">
        <v-card class="cards pa-5 login-card">
          <h2 class="text-center ma-5 card-h-title">
            به سامانه مدیریت اساتید و دروس خوش آمدید!
          </h2>
          <v-progress-linear
            indeterminate
            absolute
            bottom
            color="primary"
          ></v-progress-linear>
        </v-card>
      </v-col>

      <v-col cols="1" sm="1" md="4" lg="4">&nbsp;</v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 0,
      role: "",
    };
  },
  methods: {
    checkToken() {
      if (localStorage.getItem("token")) {
        setTimeout(() => {
          this.counter++;
          if (this.counter == 2) {
            let role = this.role
            role
              ? this.$router.push("/" + role + "/dashboard")
              : this.$router.push("/login");
          }
        }, 2500);

        this.$http
        .get(
          this.baseUrl + "/api/v1/check-token",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
          .then((res) => {
            if (res.data.response.status == 200) {
              this.counter++;
              this.role = res.data.response.data.role;
              this.counter == 2;
              let role = this.role
              role
                ? this.$router.push("/" + role + "/dashboard")
                : this.$router.push("/login");
            } else {
              localStorage.removeItem("token");
              this.counter++;
              this.counter == 2 ? this.$router.push("/login") : "";
            }
          })
          .catch((err) => {
            localStorage.removeItem("token");
            this.counter++;
            this.counter == 2 ? this.$router.push("/login") : "";
          });
      } else {
        setTimeout(() => {
          this.$router.push("/login");
        }, 2500);
      }
    },
  },
  mounted() {
    this.checkToken();
  },
};
</script>
