<template>
  <el-dialog id="rule-group-edit-dialog"
             title="规则集编辑"
             :visible="visible"
             size="large"
             :show-close=false>
    <el-row>
      <div style="width:412px;float:left">
        <el-row class="table-search-container">
          <el-form class="dialog-edit-content">
            <!--<el-form-item class="selectRule">-->
              <!--<el-select v-model="keyType" placeholder="请选择">-->
                <!--<el-option-->
                  <!--v-for="item in ruleGroupTypeOption"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item class="ruleType">
              <!-- 分类筛选 -->
              <cascader
              :isRule="true"
              @valueChange="valueChange">
              </cascader>
            </el-form-item>
            <el-form-item class="searchRule">
              <el-input v-model="key" placeholder="请输入关键字"></el-input>
            </el-form-item>
          </el-form>
        </el-row>
        <el-table
          ref="rulesTable"
          :data="filteredRules"
          :height="rulesTableHight"
          tooltip-effect="dark"
          @select-all="selectAll"
          @select="select">
          <el-table-column
            type="selection"
            width="37">
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="名称"
            show-overflow-tooltip width="140">
          </el-table-column>
          <el-table-column
            align="center"
            prop="ruleType"
            label="类型"
            :formatter="formatRuleType"
            show-overflow-tooltip width="82">
          </el-table-column>
          <el-table-column
            align="center"
            prop="categoryName"
            label="分类"
            show-overflow-tooltip width="82">
          </el-table-column>
          <el-table-column
            align="center"
            prop="priority"
            label="优先级"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <div v-model="listenRules" style="display: none"></div>
      <div style="width:364px;float:left;margin-left:20px;">
        <el-row v-if="checkedRules.denyRules && checkedRules.denyRules.rules.length > 0"
                class="table-title-container">
          <el-form :inline="true" class="dialog-edit-content">
            <el-form-item label="拒绝规则">
            </el-form-item>
            <el-form-item label="选择执行方式" class="right" label-width="100px">
              <el-radio-group v-model="checkedRules.denyRules.isSerial">
                <el-radio-button :label="0">并行</el-radio-button>
                <el-radio-button :label="1">串行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <view-table :cols="viewTableCols"
                      :data="checkedRules.denyRules.rules"
                      :max-height="denyRulesTableHight"></view-table>
        </el-row>
        <el-row v-if="checkedRules.addOrSubRules && checkedRules.addOrSubRules.rules.length > 0"
                class="table-title-container">
          <el-form :inline="true" class="dialog-edit-content">
            <el-form-item label="加减分规则">
            </el-form-item>
            <el-form-item label="设置阈值" class="right" label-width="80px">
              <el-input type="number" class="ssform-inline"
                        v-model="checkedRules.addOrSubRules.threshold"
                        @mousemove.native.stop=""
                        @mouseup.native.stop=""></el-input>
            </el-form-item>
          </el-form>
          <view-table :cols="viewTableCols"
                      :data="checkedRules.addOrSubRules.rules"
                      :max-height="addOrSubRulesTableHight"></view-table>
        </el-row>
        <el-row v-if="checkedRules.focusRules && checkedRules.focusRules.length >0"
                class="table-title-container">
          <el-form :inline="true" class="dialog-edit-content">
            <el-form-item label="关注性规则">
            </el-form-item>
          </el-form>
          <view-table :cols="viewTableCols"
                      :data="checkedRules.focusRules"
                      :max-height="focusRulesTableHight"></view-table>
        </el-row>
      </div>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="isReadOnly" @click="ok">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
//  import selectOptionMixin from '../../../../mixins/select-option.mixin'
//  import ViewTable from '../../../../components/ViewTable.vue'
//  import Cascader from '../../../../components/Cascader.vue'
//  import GeneralRuleApi from '../../../../common-setting/general-rule/scripts/api'
//  import EngineRuleApi from '../../../../engine-manage/rule/scripts/api'
  import * as _ from 'lodash'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      ruleGroup: {
        type: Object,
        default () {
          return {}
        }
      },
      rules: {
        type: Array,
        default () {
          return []
        }
      }
    },
    mixins: [selectOptionMixin],
    components: {
      'cascader' : Cascader,
      'view-table': ViewTable
    },
    data () {
      return {
        keyType: 0,
        key: '',
        currentRules:[],
        engineId:this.$route.params.engineId,
        checkedRules: _.cloneDeep(this.ruleGroup),
        viewTableCols: [
          {
            prop: 'name',
            label: '规则名称'
          },
          {
            prop: 'categoryName',
            label: '规则分类'
          },
          {
            prop: 'priority',
            label: '优先级'
          }
        ],
        rulesTableHight: '280',
        addOrSubRulesTableHight: 240,
        focusRulesTableHight: 240,
        denyRulesTableHight: 240
      }
    },
    watch: {
      ruleGroup () {
        this.checkedRules = _.cloneDeep(this.ruleGroup)
      }
    },
    created () {

    },
    computed: {
      listenRules(){
        if(this.rules.length){
          this.currentRules = this.rules;
        }
      },
      filteredRules () {
        let filteredRules = this.currentRules
        let key = _.trim(this.key)
        if (key) {
          switch (this.keyType) {
            case 0:
              filteredRules = _.filter(filteredRules, item => {
                return this.isContainsKey(item.name, key) || this.isContainsKey(item.categoryName, key)
              })
              break
            case 1:
              filteredRules = _.filter(filteredRules, item => {
                return this.isContainsKey(item.name, key)
              })
              break
            case 2:
              filteredRules = _.filter(filteredRules, item => {
                return this.isContainsKey(item.categoryName, key)
              })
              break
            default:
              break
          }
        }
        this.setDefaultChecked()
        return filteredRules
      },
      isReadOnly () {
        return this.$root.$data.isReadOnly
      }
    },
    methods: {
      isContainsKey (value, key) {
        return value && value.indexOf(key) > -1
      },
      valueChange(data){
        if(_.first(data)=== 1){
          if(data.length>1){
            GeneralRuleApi.rule.get('',this.engineId,_.last(data),'',{},'').then((data)=>{
              this.currentRules=data.list;
            })
          }else{
            GeneralRuleApi.rule.get('',this.engineId,0,'',{}).then((data)=>{
              this.currentRules=data.list;
            })
          }
        }else if(_.first(data)=== 2){
          if(data.length>1){
            EngineRuleApi.rule.get(this.engineId,_.last(data),'',{pageNo:0,pageSize:0},'','').then(data=>{
              this.currentRules=data.list;
            })
          }else{
            EngineRuleApi.rule.get(this.engineId,'0','',{pageNo:0,pageSize:0},'','').then(data=>{
              this.currentRules=_.filter(data.list,(o)=>{
                return o.engineId!=undefined
              });
            })
          }
        }else{
          this.currentRules=this.rules;
        }
      },
      setDefaultChecked () {
        this.sortRules()
        this.$nextTick(() => {
          if (_.isEmpty(this.checkedRules)) {
            return
          }
          _.forEach(this.filteredRules, row => {
            let data = this.getSpecialCheckedRules(row.ruleType)
            this.$refs.rulesTable.toggleRowSelection(row, !_.isEmpty(_.find(data, {code: row.code})))
          })
        })
      },
      select (selection, row) {
        let targetData = this.getSpecialCheckedRules(row.ruleType)
        if (_.isEmpty(_.find(targetData, {code: row.code}))) {
          targetData.push({
            code: row.code,
            id: row.id,
            name: row.name,
            parentId: row.parentId,
            priority: row.priority,
            categoryName: row.categoryName
          })
        } else {
          let index = _.findIndex(targetData, {code: row.code})
          targetData.splice(index, 1)
        }
        this.sortRules()

        // 控制高度
        this.updateHeight()
      },
      sortRules () {
        this.checkedRules.denyRules.rules = _.sortBy(this.checkedRules.denyRules.rules, 'priority')
      },
      selectAll (selection) {
        this.clearChecked()
        _.forEach(selection, row => {
          this.checkedRow(row)
        })
        this.sortRules()
      },
      getSpecialCheckedRules (type) {
        switch (type) {
          case 0:
            return this.checkedRules.denyRules.rules
          case 1:
            return this.checkedRules.addOrSubRules.rules
          case 2:
            return this.checkedRules.focusRules
          default:
            return []
        }
      },
      checkedRow (row) {
        let targetData = this.getSpecialCheckedRules(row.ruleType)
        targetData.push({
          code: row.code,
          id: row.id,
          name: row.name,
          parentId: row.parentId,
          priority: row.priority,
          categoryName: row.categoryName
        })

        // 控制高度
        this.updateHeight()
      },
      updateHeight () {
        let hasDeny = this.checkedRules.denyRules.rules.length > 0
        // eslint-disable-next-line no-unused-vars
        let count = this.checkedRules.denyRules.rules.length

        let hasAddOrSub = this.checkedRules.addOrSubRules.rules.length > 0
        count += this.checkedRules.addOrSubRules.rules.length

        let hasFocus = this.checkedRules.focusRules.length > 0
        count += this.checkedRules.focusRules.length

        if (hasAddOrSub && hasFocus && hasDeny) {
          this.rulesTableHight = '370'
        } else if ((hasAddOrSub && hasFocus) || (hasAddOrSub && hasDeny) || (hasFocus && hasDeny)) {
          this.rulesTableHight = '280'
          this.addOrSubRulesTableHight = 120
          this.focusRulesTableHight = 120
          this.denyRulesTableHight = 120
        } else {
          this.rulesTableHight = '280'
          this.addOrSubRulesTableHight = 240
          this.focusRulesTableHight = 240
          this.denyRulesTableHight = 240
        }

      },
      clearChecked () {
        this.checkedRules.denyRules.rules = []
        this.checkedRules.addOrSubRules.rules = []
        this.checkedRules.focusRules = []
      },
      getRuleTypeLabel (value) {
        let option = _.find(this.ruleTypeOption, {value: value})
        return option && option.label
      },
      formatRuleType (row, column) {
        let value = row[column.property]
        return this.getRuleTypeLabel(value)
      },
      cancel () {
        this.$emit('cancel')
      },
      ok () {
        if (this.checkedRules.addOrSubRules.threshold!=='' && _.isNumber(parseFloat(this.checkedRules.addOrSubRules.threshold))) {
          this.checkedRules.selectedRule = _.concat(this.checkedRules.addOrSubRules.rules,
            this.checkedRules.denyRules.rules, this.checkedRules.focusRules)
          this.$emit('ok', _.cloneDeep(this.checkedRules))
        } else {
          this.$message.warning('加减分规则，阈值不能为空！')
        }

      }
    }
  }
</script>
<style lang="scss">
  #rule-group-edit-dialog {
    .el-dialog.el-dialog--large {
      width: 856px;
    }
    .ssform-inline {
      width: 136px;
    }

    .table-title-container {
      margin-top: 20px;
    }

    .table-title-container:first-child {
      margin-top: 0px;
    }
    .el-form--inline .el-form-item {
      margin-right: 0px;
    }

  }
</style>
