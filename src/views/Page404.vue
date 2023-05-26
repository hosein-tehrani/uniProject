<template>
 <!-- if we had 404 error show this page -->
  <div class="app flex-row align-items-center">
    <div class="container">
      <v-row class="justify-content-center">
        <v-col md="12">
          <div class="clearfix">
            <h1 class="float-left display-3 ms-4 me-4">404</h1>
            <h4 class="pt-3">برگه یافت نشد</h4>
            <a href="/">
              <p class="text-muted">بازگشت به خانه</p>
            </a>
          </div>

        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>
