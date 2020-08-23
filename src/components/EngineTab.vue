<template>
  <div id="engine-tab">
    <engine-list v-if="isShowEngineHomePage"></engine-list>
    <div class="module-container" v-if="!isShowEngineHomePage">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      isShowEngineHomePage: false,
      homePageRouteName: 'engine-list'
    }
  },
  created () {
    this.isShowEngineHomePage = false
    this.homePageRouteName = 'engine-list'
  },
  methods: {
  }
}
</script>
<style lang="scss">
  $tab-height: 32px;
  $border-bottom: 1px solid #4390EF;
  #engine-tab {
    height: 100%;
    width: 100%;
    .back-icon-container {
      .el-icon-plus:before {
        content: '\e601';
      }
      .el-tabs__new-tab {
        border: none;
        font-size: 19px;
      }
    }
    .item-tab {
      .el-tabs__header {
        height: $tab-height;
        margin: 0;
        border-bottom: $border-bottom;
        .el-tabs__new-tab {
          float: left;
          position: relative;
          right: 46px;
          margin: 5px 0 0 10px;
        }
        .el-tabs__nav-wrap {
          position: absolute;
        }
        .el-tabs__item {
          height: $tab-height;
          line-height: $tab-height;
          font-size: 12px;
          &.is-active.is-closable {
            border-bottom: $border-bottom;
          }
        }
      }
    }
    .module-container {
      width: 100%;
      height: calc(100% - 34px);
    }
  }
</style>
