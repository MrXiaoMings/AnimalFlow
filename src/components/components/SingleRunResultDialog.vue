<template>
  <el-dialog id="single-run-result-dialog"
             :title="title"
             :visible="visible"
             :size="!isDetail || singleResultData.status !== flowNodeStatus.SUCCESS ? 'tiny' : 'large'"
             :show-close=false>

    <template
      v-if="singleResultData.status == flowNodeStatus.SUCCESS">
      <div style="width:130px;margin:0 auto;"><span
        style="line-height:50px;display:inline-block; margin-right:20px;text-align:center;width:60px;float: left;">运行成功</span>
        <el-progress type="circle" :percentage="100" :width="50" status="success"></el-progress>
      </div>
    </template>
    <template v-else>
      <!--<template v-if="singleResultData.status == flowNodeStatus.NOBRANCH">-->
        <!--<div style="width:320px;margin:0 auto;">-->
          <!--<span style="line-height:50px;display:inline-block; margin-right:20px;text-align:center;float: left;">运行成功,未命中各分支条件,无输出结果</span>-->
          <!--<img :src="`${url.rootPath}/lib/img/tip.svg`" style="width: 46px;"/>-->
        <!--</div>-->
      <!--</template>-->
      <!--<template v-else>-->
        <div style=" color:red;width:130px;margin:0 auto;"><span
          style="line-height:50px;display:inline-block; margin-right:20px;text-align:center;width:60px;float: left;">运行失败</span>
          <el-progress type="circle" :percentage="100" :width="50" status="exception"></el-progress>
        </div>
      <!--</template>-->
    </template>
    <template v-if="singleResultData.status == flowNodeStatus.SUCCESS">
      <div class="content-center"style="margin-left: 5%;width: 90%">
        <div style="clear:both;margin-top:20px;text-align: left">
          节点名称： {{nodeResult.nodeName}}
        </div>
        <div style="clear:both;margin-top:20px;text-align: left">
          <span style="display: inline-block;vertical-align: top">节点结果：</span>
          <ul style="display: inline-block">
            <li v-for="item in nodeResult.nodeResult">{{item}}</li>
          </ul>
        </div>
        <div v-if="isDetail" style="clear:both;margin-top:20px;text-align: left">
          <span style="display: inline-block;vertical-align: top">节点明细：</span>
          <div style="display: inline-block; width: calc(100% - 80px)">
            <el-table
              :data="nodeResult.detail"
              border
              style="width: 100%">
              <el-table-column
                prop="itemName"
                align="center"
                label="明细名称">
              </el-table-column>
              <el-table-column
                prop="detail"
                align="center"
                label="执行结果">
              </el-table-column>
              <el-table-column
                prop="execState"
                align="center"
                label="执行状态">
              </el-table-column>
            </el-table>
          </div>

        </div>
      </div>

    </template>
    <template v-else>
      <div style="margin-top:20px;margin-bottom: 20px; text-align: center">{{singleResultData.msg}}</div>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="returnField">返回</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
//  import resultApi from '../../../decision-result/scripts/api'
import flownodeType from '../../mock/node-type.mock'
//  import flowNodeStatus from '../../../decision-result/mock/node-status.mock'
import * as _ from 'lodash'

  let url = require('../../scripts/url')
export default {
  props: {
    title: {
      type: String,
      default: '测试'
    },
    visible: {
      type: Boolean,
      default: false
    },
    runNode: {
      type: Object,
      default () {
        return {}
      }
    },
    singleResultData: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      flownodeType: flownodeType,
      flowNodeStatus: flowNodeStatus,
      nodeResult: {},
      allResultData: [],
      runResult: [],
      isDetail: false,
      url: url
    }
  },
  created () {
  },
  watch: {
    singleResultData () {
      if (this.singleResultData !== null) {
        let res = this.singleResultData
        res.nodeType = this.runNode.nodeType
        if (res.nodeType === 5 || res.nodeType === 6 || res.nodeType === 2) {
          this.isDetail = true
        } else {
          this.isDetail = false
        }
        this.nodeResult = res.singleNodeResult
        if (this.nodeResult.nodeResult.indexOf(';') !== -1) {
          this.nodeResult.nodeResult = this.nodeResult.nodeResult.split(';')
        } else {
          this.nodeResult.nodeResult = [this.nodeResult.nodeResult]
        }
      }
    }
  },
  methods: {
    returnField () {
      this.$emit('returnField')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss">
  #field-input-dialog {
    .el-select {
      width: 100%;
    }
  }

  .is-hide {
    display: none;
  }
</style>
