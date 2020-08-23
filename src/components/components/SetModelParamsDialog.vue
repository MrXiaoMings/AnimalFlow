<template>
  <el-dialog :title="title"
             class="set-model-dialog"
             :visible="visible"
             size="tiny"
             :show-close=false>
    <el-row style="margin-bottom: 10px;">
      <el-col :span="24">
        <span v-text="subTitle"></span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <ModelParamsTable ref="modelParamsTable"
                          :detailResult="paramsTable.detailResult"
                          :fieldsData="fieldsData"
                          :isReadOnly="isReadOnly"
                          @selectInputChange="selectInputChange"
                          @selectOutputChange="selectOutputChange"
                          :tableHead="paramsTable.tableHead">
        </ModelParamsTable>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="ok" :disabled="isReadOnly">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
//  import ModelParamsTable from '../../../../common-setting/model-management/components/ModelParamsTable.vue'

  export default {
    name: "SetModelParamsDialog",
    data() {
      return {
        inputsPromise: null,
        outputsPromise: null
      }
    },
    props: {
      fieldsData: {
        numberInputFields: [],
        numberOutputFields: []
      },
      version: {
        type: Object,
        default() {
          return {}
        }
      },
      paramsTable: {
        type: Object,
        default: {
          tableHead: ['模型参数', '参数类型', '映射字段'],
          detailResult: []
        }
      },
      node: {
        type: Object,
        default() {
          return {}
        }
      },
      isReadOnly: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    created() {
      // this.loadOutFieldData()
      // this.loadInputFieldData()
    },
    methods: {
      selectInputChange(index, fieldEn) {
        let field_id = _.find(this.fieldsData.numberInputFields, {fieldEn: fieldEn}).fieldId
        this.$emit('selectInputChange1', index, field_id)
      },
      selectOutputChange(index, fieldEn) {
        let field_id = _.find(this.fieldsData.numberOutputFields, {fieldEn: fieldEn}).id
        this.$emit('selectOutputChange1', index, field_id);
      },
      cancel() {
        this.$emit('cancel');
      },
      ok() {
        this.$refs.modelParamsTable.validate().then(res => {
          if (res) {
            const that = this
            _.each(that.paramsTable.detailResult, data => {
              _.each(data.fieldAttribute, item => {
                if (data.fieldType === "输出参数") {
                  item.fieldCn = _.filter(that.fieldsData.numberOutputFields, {fieldEn: item.fieldEn})[0].fieldCn
                } else {
                  item.fieldCn = _.filter(that.fieldsData.numberInputFields, {fieldEn: item.fieldEn})[0].fieldCn
                }
              })
            })
            this.$emit('ok', this.paramsTable.detailResult, this.fieldsData)
          }
        })
      }
    },
    components: {ModelParamsTable}

  }
</script>

<style lang="scss">
  .set-model-dialog {
    .el-dialog.el-dialog--tiny {
      width: 43%;
    }
  }
</style>
