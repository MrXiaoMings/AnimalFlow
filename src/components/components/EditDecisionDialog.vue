<template>
   <div id="decision-dialog">
     <el-dialog :visible="visible"
                :show-close=false
                size="large"
                :class="{fullscreen: isFullscreen}"
     >
       <div slot="title" class="el-dialog__title">
         <span>编辑决策</span>
         <i class="iconfont iconstyle" @click="controlScreenSize" v-html="isFullscreen?'&#xe67e;':'&#xe680;'"></i>
       </div>
       <el-tabs :active-name="decisionOption.conditionType+'' ==='-1'?'2':decisionOption.conditionType+''"
                @tab-click="tabChange">
         <el-tab-pane label="决策表" name="2">
           <decision-table :inputs="decisionOption.inputs"
                           :output="decisionOption.output"
                           :data="decisionOption.decisionTable"
                           :ref="2"
                           :node="node"
                           :isScreenfull="isFullscreen"
                           @change="decisionTableChange"
                           @validateChange="(value)=>{validateChange(value,2)}"></decision-table>
         </el-tab-pane>
         <el-tab-pane label="决策条件" name="1">
           <condition-region :data="decisionOption.decisionCondition"
                             :fieldData="decisionOption.inputs"
                             :outputField="decisionOption.output"
                             :disabled="disabled"
                             :isShowOutPutTitle="true"
                             :ref="1"
                             :isScreenfull="isFullscreen"
                             @change="decisionConditionChange"></condition-region>
         </el-tab-pane>
         <el-tab-pane label="决策公式" name="3">
           <formula :inputFields="inputs"
                    :isReadOnly="isReadOnly"
                    :isModal="isModal"
                    :outputField="decisionOption.output"
                    :initFormula="decisionOption.formulas"
                    ref="3"
                    @getFormular="formulaChange"></formula>
         </el-tab-pane>
       </el-tabs>
       <div slot="footer" class="dialog-footer" :class="{screenfooter: isFullscreen}">
         <el-button type="primary"
                    :disabled="isReadOnly"
                    @click="ok">启用
         </el-button>
         <el-button @click="cancel">取消</el-button>
       </div>
     </el-dialog>
   </div>
</template>
<script>
  import DecisionTable from './DecisionTable.vue'
//  import ConditionRegion from '../../../../components/ConditionRegion.vue'
//  import Formula from '../../../../components/formula/Formula.vue'
  import bus from '../../../scripts/bus'
  import * as _ from 'lodash'

  export default {
    props: {
      node: {
        type: Object,
        default () {
          return {}
        }
      },
      visible: {
        type: Boolean,
        default: false
      },
      isModal:{
        type: Boolean,
        default:true
      },
      isReadOnly: {
        type: Boolean,
        default: false
      },
      inputs:{
        type:Array,
        default:[]
      },
      data: [Object]
    },
    components: {
      'decision-table': DecisionTable,
      'condition-region': ConditionRegion,
      'formula': Formula
    },
    data () {
      return {
        decisionOption: _.cloneDeep(this.data),
        validatedDic: {},
        disabled:this.$root.$data.isReadOnly,
        isFullscreen: false
      }
    },
    computed: {
      isDisabledOkBtn () {
        return this.isReadOnly || this.validatedDic[this.decisionOption.conditionType] === false
      }
    },
    created(){
      bus.$on('validateResult', (data) => {
        if (data) {
          this.$emit('ok', this.decisionOption)
        }
      })
    },
    watch: {
      data () {
        this.decisionOption = _.cloneDeep(this.data)
      }
    },
    methods: {
      cancel () {
        this.$emit('cancel')
      },
      checkHasRepeated (data, inputs) {
        const sourceData = _.cloneDeep(data)
        var isrepeat=false
        for(var i = 0;i<sourceData.length-1 && !isrepeat;i++) {
          for (var j = i + 1; j < sourceData.length && !isrepeat; j++) {
            for (var k = 0; k < inputs.length; k++) {
              if (sourceData[i][k].valueType === 4 ) {
                if (Date.parse(sourceData[i][k].fieldValue[0])!==Date.parse(sourceData[j][k].fieldValue[0]) && Date.parse(sourceData[i][k].fieldValue[1])!==Date.parse(sourceData[j][k].fieldValue[1])) {
                  break
                }
              } else {
                if(sourceData[i][k].fieldValue !== sourceData[j][k].fieldValue) {
                  break
                }
              }
              if (k === inputs.length - 1) {
                isrepeat = true
                break
              }
            }
          }
        }
        return isrepeat
      },
      ok () {
        if(this.decisionOption.conditionType ==='1'){
          let isValidate = this.$refs[this.decisionOption.conditionType].validate()
          if(isValidate){
            this.$emit('ok', this.decisionOption);
          }
        } else if (this.decisionOption.conditionType == 2 || this.decisionOption.conditionType == -1) {
          var isData= true
          this.$refs[2].change()
          if(this.decisionOption.decisionTable.length){
            this.$refs[2].$validator.validateAll().then((result) => {
              this.decisionOption.conditionType = 2
              if (result) {
                var isrepeat = this.checkHasRepeated(this.decisionOption.decisionTable, this.decisionOption.inputs)
                if (!isrepeat) {
                  _.forEach(this.decisionOption.decisionTable,(arr)=>{
                    if(arr.length>0){
                      _.forEach(arr,(obj)=>{
                        if(!obj.fieldValue || _.isEqual(obj.fieldValue, [null,null]) || obj.fieldValue === "[null,null]"){
                          isData=false;
                          return;
                        }
                      })
                    }else{
                      isData=false;
                      return;
                    }
                  })
                  if(isData){
                    this.$emit('ok', this.decisionOption);
                  }else{
                    this.$message.warning('决策表含有未配置项！');
                  }
                } else {
                  this.$message.warning('配置输入项有重复！');
                }
              }
            })
          }else{
            this.$message.warning('请配置决策表！');
          }
        }else if(this.decisionOption.conditionType == 3){
          var isData=true;
          _.forEach(this.decisionOption.formulas.conditions,(obj)=>{
            if(obj.formula==""){
              isData=false;
            }
          })
          if(isData){
            this.$emit('ok', this.decisionOption);
          }else{
            if(this.decisionOption.formulas.conditions>1){
              this.$message.warning('含有未配置的公式！');
            }else{
              this.$message.warning('请配置公式！');
            }

          }
        }else{
          this.$message.warning('请选择决策方式！');
        }

      },
      tabChange (tab) {
        this.decisionOption.conditionType = tab.name
      },
      validateChange (value, conditionType) {
        /**
         * 属性可能是动态添加的，所以需要使用set */
        this.$set(this.validatedDic, conditionType, value)
      },
      decisionTableChange (decisionTable) {
        this.decisionOption.decisionTable = decisionTable
      },
      decisionConditionChange (conditions) {
        this.decisionOption.decisionCondition = conditions
      },
      formulaChange (value) {
        this.decisionOption.formulas = value
      },
      controlScreenSize() {
        this.isFullscreen = !this.isFullscreen
      }
    }
  }
</script>
<style lang="scss">
   #decision-dialog {
      .el-dialog__wrapper.fullscreen{
        .el-dialog.el-dialog--large{
          width: 100%;
          height: 100%;
          overflow: auto;
          margin: 0 0;
          max-width: 100%;
          top: 0% !important;
        }
      }
     .screenfooter {
       margin-left: 29px;
       text-align: left;
     }
     .el-dialog__title {
        .iconfont{
          float: right;
          right: 15px;
          color: white;
          cursor: pointer;
        }
      }
     .el-tabs {
        .el-tabs__header {
          border-bottom: 1px solid #d1dbe5;
          padding: 0;
          position: relative;
          margin: 0 0 15px;
          .el-tabs__nav-wrap {
            overflow: hidden;
            margin-bottom: -1px;
            position: relative;
            .el-tabs__nav-scroll {
              overflow: hidden;
              .el-tabs__nav {
                position: relative;
                transition: transform .3s;
                float: left;
                .el-tabs__active-bar {
                  width: 88px;
                  transform: translateX(0px);
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  height: 3px;
                  background-color: #20a0ff;
                  z-index: 1;
                  transition: transform .3s cubic-bezier(.645,.045,.355,1);
                  list-style: none;
                }
                .el-tabs__item.is-active {
                  color: #20a0ff;
                }
                .el-tabs__item {
                  padding: 0 16px;
                  height: 42px;
                  box-sizing: border-box;
                  line-height: 42px;
                  display: inline-block;
                  list-style: none;
                  font-size: 14px;
                  color: #676767;
                  position: relative;
                }

                .el-tabs__item:hover {
                  color: #1f2d3d;
                  cursor: pointer;
                }
                .el-tabs__item.is-active:hover {
                  cursor: pointer;
                  color: #20a0ff;
                }
              }
            }
          }
        }
        .c-field-equation {
          margin: 0 0;
        }

        .el-tab-pane {
          padding-top: 20px;
        }
      }
   }
</style>
