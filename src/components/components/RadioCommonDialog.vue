<template>
  <el-dialog :title="title"
             :visible="visible"
             size="tiny"
             :show-close=false>
    <el-row style="margin-bottom: 10px;">
      <el-col :span="12">
        <span v-text="subTitle"></span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          ref="table"
          max-height="280"
          :data="data"
          tooltip-effect="dark">
          <el-table-column width="55"
                           align="center">
            <template slot-scope="scope">
              <el-radio v-model="currentCheckedId" :label="scope.row.id"><span></span></el-radio>
            </template>
          </el-table-column>
          <el-table-column
            v-for="col in cols"
            align="center"
            :prop="col.prop"
            :label="col.label"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/babel">
  export default {
    name: 'RadioCommonDialog',
    props: {
      checkedId: Number,
      data: {
        type: Array,
        default () {
          return []
        }
      },
      title: {
        type: String,
        default () {
          return ''
        }
      },
      subTitle: {
        type: String,
        default () {
          return ''
        }
      },
      visible: {
        type: Boolean,
        default: false
      },
      cols: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        currentCheckedId: this.checkedId
      }
    },
    watch: {
      checkedId () {
        this.currentCheckedId = this.checkedId
      }
    },
    computed: {},
    methods: {
      cancel () {
        this.$emit('cancel')
      },
      ok () {
        this.$emit('ok', this.currentCheckedId)
      }
    }
  }
</script>
<style type="scss" scoped>

</style>
