<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "app",
};
</script>

<style lang="scss">
/* Import Font Awesome Icons Set */
$fa-font-path: "~font-awesome/fonts/";
@import "~font-awesome/scss/font-awesome.scss";

/* Import Bootstrap Vue Styles */
@import "~bootstrap-vue/dist/bootstrap-vue.css";
// Import Main styles for this application
@import "assets/scss/style";
/* Import custom scss */
@import "assets/scss/_custom.scss";
a{
  text-decoration: none !important;
  // color: unset !important;
}
.nav-link.active{
      color: white !important;
}

</style>
