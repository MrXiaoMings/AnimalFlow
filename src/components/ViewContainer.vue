<template>
  <div style="height: 100%;">
    <div class="left-nav-bar">
      <left-nav-bar></left-nav-bar>
    </div>
    <div class="content-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import LeftNavBar from './LeftNavBar.vue'

  export default {
    components: {
      LeftNavBar
    }
  }
</script>
<style lang="scss" scoped>
  .content-container{
    background-color: #f9f9f9;
    min-height: 500px!important;
  }
</style>

