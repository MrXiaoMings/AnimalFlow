<template>
  <el-dialog id="batch-run-result-dialog"
             :title="title"
             :visible="visible"
             size="tiny"
             :show-close=false>


    <template v-if="1 == batchRunResultState">
      <div style="width:130px;margin:0 auto;"><span
        style="line-height:50px;display:inline-block;float:left;margin-right:20px;text-align:center;width:60px;">运行成功</span>
        <el-progress type="circle" :percentage="100" :width="50" status="success"></el-progress>
      </div>
    </template>
    <template v-else>
      <div style="width:130px;margin:0 auto;"><span
        style="line-height:50px;display:inline-block;float:left;margin-right:20px;text-align:center;width:60px;color:red">运行失败</span>
        <el-progress type="circle" :percentage="100" :width="50" status="fail"></el-progress>
      </div>
    </template>
    <a :href="''+resultUrl"><i class="iconfont">&#xe61d;</i>下载运行结果</a>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="returnBatch">返回</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
//  import flowNodeStatus from '../../../decision-result/mock/node-status.mock'

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
      resultUrl: {
        type: String,
        default: ''
      },
      batchRunResultState: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        flowNodeStatus: flowNodeStatus
      }
    },
    created () {

    },
    methods: {
      returnBatch () {
        this.$emit('returnBatch')
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
</style>
