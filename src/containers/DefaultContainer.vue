<template>
  <div class="app defaultContainer-component">
    <Sidebar class="dontPrint" style="z-index:100;" @navToggled="navToggled($event)"> </Sidebar>
    <div class="app-body mb-10" :class="sidebarOpen ? 'main-mr' : ''">
      <main class="main">
        <div class="container-fluid">
          <div class="element">&nbsp;</div>
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      sidebarOpen: false
    };
  },
  methods: {
    navToggled(e) {
      this.sidebarOpen = e;
    }
  }
};
</script>
