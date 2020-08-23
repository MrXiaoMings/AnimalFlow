<template>
  <div id="engine-container">
    <div class="content-container"
         :class="{'full-width':!isShowLeftBar}">
      <engine-tab @tabTypeChange="(val)=>{isShowLeftBar=!val}"></engine-tab>
    </div>
  </div>
</template>
<script>
import EngineTab from './components/EngineTab.vue'

export default {
  data () {
    return {
      isShowLeftBar: true
    }
  },
  components: {
    'engine-tab': EngineTab
  }
}
</script>
<style lang="scss">
  #engine-container {
    height: calc(100% - 5px);
    padding-top: 5px;
    .full-width {
      width: 100% !important;
    }
  }
</style>
