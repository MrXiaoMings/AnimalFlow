<template>
  <div id="decision-table">
    <el-form ref="decisionTable" label-width="80px">
      <el-form-item label="填写方式:" >
        <el-radio-group v-model="radioValue" @change="formTypeChange">
          <el-radio :label="1">手动填写</el-radio>
          <el-radio :label="2">批量导入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="radioValue===2" label="选择文件:">
        <el-upload
          :action="importURL"
          class="upload-demo"
          ref="upload"
          :multiple="false"
          :on-success="uploadSuccess"
          :on-error="handleError"
          :auto-upload=true
        >
          <el-button slot="trigger" size="small" type="primary" :disabled="isReadOnly">导入文件</el-button>
          <span>仅支持excel格式，</span>
          <el-button type="text" size="small" class="down-load-template" @click="downloadTemplate">下载模板</el-button>
          <a href="" download="template.xlsx" id="export-template" style="visibility: hidden;">下载模板</a>
        </el-upload>
      </el-form-item>
      <el-form-item label="决策表:">
        <el-table
          :data="decisionTable"
          :max-height="maxHeight"
          border
          tooltip-effect="dark">
          <el-table-column
            align="center"
            width="68"
            type="index"
            label="序号">
          </el-table-column>
          <template v-for="(input,index) in inputs">
            <el-table-column
              align="center"
              :key="index"
              :prop="input.fieldEn"
              :label="input.fieldCn"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <template v-if="isEnumField(input)">
                  <el-tooltip :disabled="!errors.has('inputFieldValue_'+index+'_'+scope.row.rowId)" placement="top">
                    <div slot="content">{{errors.first('inputFieldValue_'+index+'_'+scope.row.rowId)}}</div>
                      <el-select @change="change"
                                 :name="'inputFieldValue_'+index+'_'+scope.row.rowId"
                                 v-validate="'required'"
                                 :class="{'input': true, 'is-danger': errors.has('inputFieldValue_'+index+'_'+scope.row.rowId) }"
                                 data-vv-as="输入字段"
                                 v-model="scope.row[input.fieldEn]"
                                 placeholder="请选择">
                        <el-option
                          v-for="item in getValueScopeOption(input.valueScope)"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-tooltip>
                </template>
                <template v-else-if="isDateField(input)">
                  <el-tooltip :disabled="!errors.has('inputFieldValue_'+index+'_'+scope.row.rowId)" placement="top">
                    <div slot="content">{{errors.first('inputFieldValue_'+index+'_'+scope.row.rowId)}}</div>
                      <el-date-picker
                        :name="'inputFieldValue_'+index+'_'+scope.row.rowId"
                        v-model="scope.row[input.fieldEn]"
                        v-validate="'required'"
                        :class="{'input': true, 'is-danger': errors.has('inputFieldValue_'+index+'_'+scope.row.rowId) }"
                        data-vv-as="输入字段"
                        data-vv-delay="10000000000000"
                        @change="() => { change() }"
                        :type="isDateFormat(input.valueScope) ? 'daterange' : 'datetimerange'"
                        placeholder="选择日期">
                      </el-date-picker>
                  </el-tooltip>
                </template>
                <template v-else-if="isNumberField(input)">
                  <el-tooltip :disabled="!errors.has('inputFieldValue_'+index+'_'+scope.row.rowId)" placement="top">
                    <div slot="content">{{errors.first('inputFieldValue_' + index + '_' + scope.row.rowId)}}</div>
                      <el-input v-model="scope.row[input.fieldEn]"
                                :name="'inputFieldValue_'+index+'_'+scope.row.rowId"
                                placeholder="请输入数值或者数值区间"
                                v-validate="'isNumberRange|required|isStartMoreThanEndValue'"
                                data-vv-as="输入值"
                                :class="{'input': true, 'is-danger': errors.has('inputFieldValue_'+index+'_'+scope.row.rowId) }"
                                @change="change">
                      </el-input>
                  </el-tooltip>
                </template>
                <template v-else>
                  <!--<el-input v-model="scope.row[input.fieldEn]" @blur="change"></el-input>-->
                  <el-tooltip :disabled="!errors.has('inputFieldValue_'+index+'_'+scope.row.rowId)" placement="top">
                    <div slot="content">{{errors.first('inputFieldValue_' + index + '_' + scope.row.rowId)}}</div>
                    <el-input v-model="scope.row[input.fieldEn]"
                              :name="'inputFieldValue_'+index+'_'+scope.row.rowId"
                              v-validate="'required'"
                              data-vv-as="输入值"
                              :class="{'input': true, 'is-danger': errors.has('inputFieldValue_'+index+'_'+scope.row.rowId) }"
                              @change="change">
                    </el-input>
                  </el-tooltip>
                </template>
              </template>
            </el-table-column>
          </template>
          <template>
            <el-table-column
              align="center"
              :prop="output.fieldEn"
              :label="output.fieldCn"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <template v-if="isEnumField(output)">
                  <el-tooltip :disabled="!errors.has('outputFieldValue_'+scope.row.rowId)" placement="top">
                    <div slot="content">{{errors.first('outputFieldValue_'+scope.row.rowId)}}</div>
                    <el-select @change="change"
                               :name="'outputFieldValue_'+scope.row.rowId"
                               v-validate="'required'"
                               :class="{'input': true, 'is-danger': errors.has('outputFieldValue_'+scope.row.rowId) }"
                               data-vv-as="输出字段"
                               v-model="scope.row[output.fieldEn]"
                               placeholder="请选择">
                      <el-option
                        v-for="item in getValueScopeOption(output.valueScope)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-tooltip>
                </template>
                <template v-else-if="isDateField(output)">
                  <el-tooltip :disabled="!errors.has('outputFieldValue_'+scope.row.rowId)" placement="top">
                    <div slot="content">{{errors.first('outputFieldValue_'+scope.row.rowId)}}</div>
                      <el-date-picker
                        :name="'outputFieldValue_'+scope.row.rowId"
                        v-model="scope.row[output.fieldEn]"
                        v-validate="'required'"
                        :class="{'input': true, 'is-danger': errors.has('outputFieldValue_'+scope.row.rowId) }"
                        data-vv-as="输出字段"
                        data-vv-delay="10000000000000"
                        @change="() => { change() }"
                        :type="isDateFormat(output.valueScope) ? 'date' : 'datetime'"
                        placeholder="选择日期">
                      </el-date-picker>
                  </el-tooltip>
                </template>
                <template v-else-if="isNumberField(output)">
                  <el-tooltip :disabled="!errors.has('outputFieldValue_'+scope.row.rowId)" placement="top">
                    <div slot="content">{{errors.first('outputFieldValue_'+scope.row.rowId)}}</div>
                    <el-input v-model="scope.row[output.fieldEn]" @change="change"
                              :name="'outputFieldValue_'+scope.row.rowId"
                              v-validate="'isNumber|required'"
                              data-vv-as="输入值"
                              placeholder="请输入数值"
                              :class="{'input': true, 'is-danger': errors.has('outputFieldValue_'+scope.row.rowId) }"
                              @mousemove.native.stop=""
                              @mouseup.native.stop=""></el-input>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-input v-model="scope.row[output.fieldEn]" @change="change"></el-input>
                </template>
              </template>
            </el-table-column>
          </template>
          <el-table-column
            align="center"
            width="68"
            label="">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteRow(scope.row.rowId)" :disabled="decisionTable.length=== 1 || isReadOnly">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="text" @click="addRow" style="margin-right: 20px;" :disabled="isReadOnly">
          <i :class="{iconfont:true, additem:isReadOnly}" style="top:1px;font-size: 16px;">&#xe649;</i>&nbsp;添加一行
        </el-button>
        <el-button type="text" size="small" @click="exportTable"><i class="iconfont" style="top:1px;font-size: 16px;">&#xe657;</i> &nbsp;导出</el-button>
        <a href="javascript:void(0);" download="decisionTable.xlsx" id="export-table" style="visibility: hidden;">&nbsp;导出</a>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//  import selectOptionMixin from '../../../../mixins/select-option.mixin'
//  import fieldMixin from '../../../../mixins/field-mixin'
//  import FieldValue from '../../../../components/FieldValue.vue'
//  import * as _ from 'lodash'
//  import {XLSXHelp} from '../../scripts/xlsx-helper'
//  import DateUtils from '../../../../scripts/date-utils'
/* eslint-disable */
const uuid = require('node-uuid')

export default {
  props: {
    node: {
      type: Object,
      default () {
        return {}
      }
    },
    inputs: {
      type: [Array],
      default () {
        return []
      }
    },
    output: {
      type: Object,
      default () {
        return {}
      }
    },
    data: [Array],
    isScreenfull: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'field-value': FieldValue
  },
  data () {
    return {
      decisionTable: this.convertToViewModel(this.data),
      radioValue: 1,
      loadTemplateURL:'',
      isReadOnly: this.$root.$data.isReadOnly,
      importURL: `/api/node/${this.node.nodeId}/decisiontable`
    }
  },
  watch: {
    errors: {
      deep: true,
      handler () {
        this.$emit('validateChange', !this.errors.any())
      }
    }
  },
  computed:{
    maxHeight () {
      const maxHeight = this.isScreenfull?'1000000':'280'
      return maxHeight
    }
  },
  mixins: [selectOptionMixin, fieldMixin],
  methods: {
    addRow () {
      let cell = {
        rowId: uuid.v1()
      }
      _.forEach(_.union(this.inputs, [this.output]), item => {
        cell[item.fieldEn] = null
      })
      this.decisionTable.push(cell)
      this.$nextTick(() => {
        const $vm = $("#decision-table .el-table__body-wrapper")[0]
        $vm.scrollTop = $vm.scrollHeight
      })
      this.change()
    },
    deleteRow (rowId) {
      let index = _.findIndex(this.decisionTable, {rowId: rowId})
      this.decisionTable.splice(index, 1)
      this.change()
    },
    change () {
      this.$emit('change', this.convertToModel(this.decisionTable))
    },
    convertToViewModel (originalData) {
      let data = []
      if (originalData.length === 0) {
        let cell = {
          rowId: uuid.v1()
        }
        _.forEach(_.union(this.inputs, [this.output]), item => {
          cell[item.fieldEn] = null
        })
        data.push(cell)
      } else {
        _.forEach(originalData, cells => {
          let tempCell = {
            rowId: uuid.v1()
          }
          _.forEach(_.union(this.inputs, [this.output]), item => {
            let cell = _.find(cells, {fieldEn: item.fieldEn}) || {}
            if (cell.valueType === 4 && !_.isArray(cell.fieldValue)) {
              // tempCell[item.fieldEn] = JSON.parse(cell.fieldValue)
              try{
                tempCell[item.fieldEn] = JSON.parse(cell.fieldValue)
              } catch(err) {
                tempCell[item.fieldEn] = cell.fieldValue
              }
            } else {
              tempCell[item.fieldEn] = cell.fieldValue
            }
          })
          data.push(tempCell)
        })
      }
      return data
    },
    convertToModel (originalData) {
      let data = []
      let groupData = _.groupBy(originalData, 'rowId')
      let dataSource = _.union(this.inputs, [this.output])
      for (let prop in groupData) {
        let item = groupData[prop]
        let row = []
        _.forEach(item, cell => {
          for (let cellProp in cell) {
            if (cellProp !== 'rowId') {
              let field = _.find(dataSource, {fieldEn: cellProp})
              if (!_.isEmpty(field)) {
                row.push({
                  fieldId: field.fieldId,
                  fieldSource: field.fieldSource,
                  fieldEn: field.fieldEn,
                  fieldCn: field.fieldCn,
                  valueScope: field.valueScope,
                  valueType: field.valueType,
                  fieldType: field.fieldType,
                  fieldValue: cell[cellProp]
                })
              }
            }
          }
        })
        data.push(row)
      }
      return data
    },
    downloadTemplate () {
      const tableHead = this.getTheTableHead()
      let xlsxHelp = new XLSXHelp(tableHead, 'export-template')
      xlsxHelp.downloadExl()
    },
    getTheTableHead () {
      const headArray = [{}]
      _.each([...this.inputs], item => {
        if (item.valueType === 4) {
          headArray[0][item.fieldCn] = '[' + [item.valueScope, item.valueScope] + ']'
        } else {
          headArray[0][item.fieldCn] = "xxx"
        }
      })
      if (this.output.valueType === 4) {
        headArray[0][this.output.fieldCn] = this.output.valueScope
      } else {
        headArray[0][this.output.fieldCn] = 'xxx'
      }
      return headArray
    },
    uploadSuccess (res, file, fileList) {
      this.decisionTable.splice(0, this.decisionTable.length)
      this.$nextTick(() => {
        if (fileList.length>1) {
          fileList.splice(0, 1)
        }
        if (res.code === "1") {
          this.decisionTable = JSON.parse(res.data)
          _.each(this.decisionTable, row => {
            row.rowId = uuid.v1()
          })
          this.change()
        } else if (res.code === "-1"){
          this.$message({type: 'warning', message: res.msg})
        }
      })
    },
    checkTableEmpty (exportData) {
      let isEmpty = true
      _.each(exportData, row => {
        _.each(row, (column, key) => {
          if (key !== "rowId" && (column || _.isEqual(column, [null,null]) || column === "[null,null]")) {
            isEmpty = false
          }
        })
      })
      return isEmpty
    },
    exportTable () {
      const that = this
      let DataToExcell = []
      let exportData = _.cloneDeep(that.decisionTable)
      if (that.checkTableEmpty(exportData)) {
        DataToExcell = this.getTheTableHead()
      } else {
        _.map(exportData, items => {
          delete items.rowId
          const row = {}
          _.map(items, (item, key) => {
            const field = _.find(that.data[0],{fieldEn: key})
            if (field.valueType === 4 && item && !_.isNull(item[0]) && !_.isNull(item[1])) {
             if (_.isArray(item)) {
               const startTimer = DateUtils.formate(item[0], field.valueScope.replace("HH","hh"))
               const endTimer = DateUtils.formate(item[1], field.valueScope.replace("HH","hh"))
               row[field.fieldCn] = '[' + [startTimer, endTimer] + ']'
             } else {
               row[field.fieldCn] = DateUtils.formate(item, field.valueScope.replace("HH","hh"))
             }
            } else if (field.valueType === 3 && item !== "") {
              const enumItems = field.valueScope.split(",")
              _.each(enumItems, datas => {
                const data = datas.split(":")
                if (item === data[1]) {
                  row[field.fieldCn] = data[0]
                }
              })
            } else {
              row[field.fieldCn] = item
            }
          })
          DataToExcell.push(row)
        })
      }
      let xlsxHelp = new XLSXHelp(DataToExcell, 'export-table')
      xlsxHelp.downloadExl()
    },
    handleError (err) {
      console.log(err)
    },
    formTypeChange (val) {
      // this.$emit('formTypeChange', val)
    }
  }
}
</script>
<style lang="scss">
  #decision-table {
    .upload-demo {
      .el-upload{
        display: inline-block;
        margin-right: 20px;
      }
    }
    .el-table {
      max-height: 1000000px !important;
    }
    .cell {
      width: 100%;
      padding: 0;
    }
    .el-date-editor {
      width: 100%;
    }

    .el-select {
      width: 100%;
    }
    .additem{
      color: #bfcbd9;
    }
  }
</style>
