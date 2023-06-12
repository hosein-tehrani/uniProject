<template>
  <div class="sidebar-component">
    <loading v-if="vLoading" />
    <v-app-bar app fixed :class="drawer ? 'header-right' : ''">
      <v-app-bar-nav-icon class="menu-button" @click="toggle">
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-menu offset-y bottom class="user-menu">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="me-2 ms-2 user-btn" text v-bind="attrs" v-on="on">
            <v-icon large class="user-icon">person_outline</v-icon>
          </v-btn>
        </template>
        <v-list class="user-list">
          <v-list-item
            v-if="role != 'reception'"
            disabled
            class="user-list-item"
            >کاربر:
            {{
              role == "admin"
                ? "مدیر سامانه"
                : "استاد"
            }}
          </v-list-item>
          <v-list-item class="text-center user-list-item" @click="logout()">
            خروج</v-list-item
          >
        </v-list>
      </v-menu>
    </v-app-bar>

    <transition name="sidebar">
      <v-navigation-drawer app v-model="drawer" class="drawer" right>
        <v-list class="menu-list">
          <v-list-item
            class="menu-items ps-0 pe-0 my-1"
            v-for="(item, index) in navigation"
            :key="index"
            route
            :to="item.route"
            @click="item.open = !item.open"
          >
            <v-list-item-content>
              <v-list-item-title
                class="item-content item-title black--text text--lighten-5 pe-3 ps-3"
              >
                <v-icon right small class="sidebar-icon">{{
                  item.icon
                }}</v-icon>
                {{ item.name }}
                <v-spacer></v-spacer>
                <v-icon
                  v-if="item.children && !item.open"
                  left
                  class="down-icon sidebar-icon"
                  >keyboard_arrow_right</v-icon
                >
                <v-icon
                  v-if="item.children && item.open"
                  left
                  class="down-icon sidebar-icon"
                  >keyboard_arrow_down</v-icon
                >
              </v-list-item-title>
              <Dropdown v-if="item.children" :list="item"></Dropdown>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            class="menu-items ps-0 pe-0 my-1 logout-item mb-15"
            @click="logout()"
          >
            <v-list-item-content>
              <v-list-item-title
                class="item-content item-title black--text text--lighten-5 ps-3 pe-3"
              >
                <v-icon right small class="sidebar-icon"> logout </v-icon>
                خروج
                <v-spacer></v-spacer>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </transition>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown";
import moment from "moment-jalaali";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Navbar",
  data() {
    return {
      role: window.localStorage.role,
      drawer: false,
      busy: false,
      sidebarOpen: false,
      useName: "",
    };
  },

  components: {
    Dropdown
  },
  methods: {
    ...mapMutations(["setUserName"]),
    toggle() {
      this.drawer = !this.drawer;
    },
    checkToken() {
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
          if (res.status == 200) {
            if (res.data.response.status == 200) {
              this.setUserName(res.data.response.data.name);
              localStorage.setItem("role", res.data.response.data.role === 'admin' ? 'admin' : 'prof');
            } else {
              this.toast("نشست شما در سامانه منقضی شده است", "error");
              this.$router.push("/login");
            }
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch((err) => {
          this.toast("نشست شما در سامانه منقضی شده است", "error");
          this.$router.push("/login");
        });
    },
    logout() {
      window.localStorage.clear();
      window.location.replace("/login");
    },
  },
  watch: {
    drawer(val, oldval) {
      this.$emit("navToggled", val);
    },
  },
  created() {
    this.checkToken();
  },
  computed: {
    ...mapGetters([
      "userName",
    ]),
    navigation() {
      let all = this.$store.getters.nav;
      let nav =
        this.role == "admin"
          ? all.adminItems
          : all.profItems;
      return nav;
    },

    name() {
      return this.$route.name;
    },

    list() {
      return this.$route.matched.filter(
        (route) => route.name || route.meta.label
      );
    },
  },
};
</script>
