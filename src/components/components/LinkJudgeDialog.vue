<template>
  <el-dialog title="连线判断"
             :visible="visible"
             size="tiny"
             id="sandbox-dialog"
             :show-close=false>
    <el-form>
      <template v-for="(item, index) in nodeData">
        <el-form-item :key="index">
          <template v-if="isSandBox">
            <el-radio :label=item.sandbox v-model="checkedName" :disabled="item.nextNode!=''">
              {{item.sandbox + '：' + item.proportion + '%'}}
            </el-radio>
          </template>
          <template v-else>
            <el-radio :label=item.groupName v-model="checkedName" :disabled="item.nextNode!=''">
              {{item.groupName}}
            </el-radio>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok" :disabled="!checkedName">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import NodeType from '../../mock/node-type.mock'
import * as _ from 'lodash'

export default {
  props: {
    data: [Object],
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      checkedName: '',
      nodeData: JSON.parse(this.data.nodeJson)
    }
  },
  computed: {
    isSandBox () {
      return this.data.nodeType === NodeType.SAND_BOX
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      _.forEach(this.nodeData, item => {
        if (item[this.isSandBox ? 'sandbox' : 'groupName'] === this.checkedName) {
          item.nextNode = _.last(_.split(this.data.nextNodes, ','))
        }
      })
      this.data.nodeJson = JSON.stringify(this.nodeData)
      this.$emit('ok', this.data)
    }
  }
}
</script>
<style lang="scss">
  #sandbox-dialog .el-dialog.el-dialog--tiny {
    width: 280px;
  }
</style>
