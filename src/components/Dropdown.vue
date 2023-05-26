<template >
<div class="dropdown-component">
  <transition name="fade" >
    <v-list v-show="list.open" class="dropdown-list">
      <v-list-item
        v-for="(item, index) in list.children"
        :key="index"
        class="sub-items item-content dropdown-items"
        route
        :to="item.route"
      >
        <v-list-item-content class="item-content">
          <v-list-item-title
            @click="item.open = !item.open"
            class="item-content item-title me-4s ms-4"
          >
            <v-icon right small class="sidebar-icon">{{ item.icon }}</v-icon>
            <span class="item-name pe-1 ps-2">{{ item.name }}</span>
          </v-list-item-title>
          <dropdown v-if="item.children" :list="item"></dropdown>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon v-if="item.children" >keyboard_arrow_down</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </transition>

</div>
</template>
<script>
export default {
  name: "dropdown",
  props: ["list"]
};
</script>

<style lang="scss">
//@import "@/assets/scss/scss_arina/_dropdown.scss";

//ul {
//  list-style: none;
//}

//.item-title {
//  font-size: 13px;
//}

//.v-list-item:hover {
//  cursor: pointer !important;
//  background-color: $hover;
//  transform: scale(1.02);
//  transition: transform 0.4s;
//}

////.sub-items {
////  .item-title {
////    //color: $hover !important;
////    overflow: hidden;
////    background: linear-gradient(to right, $sidebar, $sidebar 50%, #7f94db 50%);
////    background-clip: text;
////    -webkit-background-clip: text;
////    -webkit-text-fill-color: transparent;
////    background-size: 200% 100%;
////    background-position: -100%;
////    transition: background-position 0.4s ease;
////  }
////}

//.sub-items:hover {
//  //.item-title {
//  //  background-position: 0 -100%;
//  //}
//  background-color: $button !important;
//  cursor: pointer !important;
//  height: auto;
//  transform: scale(1.01);
//  transition: all 0.3s;
//}
//.sub-items .item-title[data-v-d436187e] {
//  -webkit-text-fill-color: $button;
//}
//.menu-items:hover {
//  .sub-items .item-title[data-v-d436187e] {
//    -webkit-text-fill-color: $sidebar;
//  }
//}

//.menu-items[data-v-7d622f5c]{
//  padding-right:0px !important; ;
//}
//.item-content {
//  display: flex;
//  align-items: center;
//}

//.v-list .v-list-item--active {
//  color: $active !important;
//}
////.dropdown-enter{
////    opacity:0;
////}
////.dropdown-enter-active{
////    transition: all .5s;
////}
////.dropdown-leave{
////    opacity: 1;
////}
////.dropdown-leave-active{
////    transition: all .5s;
////    opacity: 0;
////}

////.slide-enter-active{
////        animation: growDown 400ms ease-in-out forwards;
////    transform-origin: top center;
////}
////@keyframes growDown {
////    0% {
////        transform: scaleY(0)
////    }
////    80% {
////        transform: scaleY(1.1)
////    }
////    100% {
////        transform: scaleY(1)
////    }
////}

////.dropdown-enter,
////.dropdown-leave-to {
////  transform: scaleY(0.7);
////  opacity: 0;
////}

////.dropdown-enter-to,
////.dropdown-leave {
////  opacity: 1;
////  transform: scaleY(1);
////}

//.drop-down-enter-active {
//  animation: drop-down 0.5s;
//}

//.drop-down-leave-active {
//  animation: drop-down 0.5s reverse;
//}

//.drop-down-move {
//  transition: transform 0.8s ease;
//}

//@keyframes drop-down {
//  from {
//    transform: scaley(0) translateY(-100%);
//    height: 0;
//  }
//  to {
//    transform: scaley(1) translateY(0);
//  }
//}
</style>
