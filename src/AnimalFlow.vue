<template>
  <div id="decision-flow">
    <div class="list-info">
      <list-info @currentNodeChange="currentNodeChange"></list-info>
    </div>
    <div class="detail-container">
      <!--执行route的监听需要一直存在-->
      <component v-show="!isShowVersionDetail"
                 :is="currentView"
                 :node="currentNode"
                 :isReadOnly="isReadOnly"
                 :version="version"
                  @currentNodeChange="currentNodeChange"></component>
    </div>
  </div>
</template>
<script>
import ListInfo from './components/ListInfo.vue'

export default {
  data () {
    return {
      currentView: null,
      currentNode: {},
      version: {},
      isReadOnly: this.$root.$data.isReadOnly,
      isShowVersionDetail: false
    }
  },
  methods: {
    currentNodeChange (node, version) {
      console.log(node, version)
    }
  },
  components: {
    'list-info': ListInfo
  }
}
</script>
<style lang="scss">
  #decision-flow {
    height: 100%;
    width: 100%;
    .list-info {
      width: calc(100% - 250px);
      height: 100%;
      box-sizing: border-box;
      float: left;
    }
    .detail-container {
      width: 250px;
      height: calc(100% - 1px);
      box-sizing: border-box;
      float: right;
    }
  }
</style>
