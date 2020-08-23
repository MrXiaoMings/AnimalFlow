<template>
  <div id="left-nav-bar">
    <el-menu :default-active="$route.matched[1].name"
             :router="false"
             :collapse="true">
      <template v-for="item in navData">
        <el-menu-item :index="item.path" :key="item.path" @click="()=>{clickMenu(item)}">
          <i class="iconfont" v-html="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
import LeftNavBarMockData from '../mock/left-nav-bar.mock'
import * as _ from 'lodash'
export default {
  data () {
    return {
      navData: LeftNavBarMockData
    }
  },
  methods: {
    clickMenu (item) {
      let path = item.path
      if (item.params) {
        this.$router.push({name: path, params: _.cloneDeep(item.params)})
      } else {
        this.$router.push({name: path})
      }
    }
  }
}
</script>
<style lang="scss">
  #left-nav-bar {
    height: 100%;
    position: relative;
    width: 50px;
    box-sizing: border-box;
    li {
      &.is-active, &:hover {
        background-color: #292E34 !important;
        .iconfont {
          color: #ffffff !important;
        }
      }
      .iconfont {
        font-size: 24px;
        color: #ACADAC;
      }
    }
    .el-menu {
      .el-menu-item {
        text-align: center;
      }
      background-color: #373F48 !important;
    }
  }
</style>
