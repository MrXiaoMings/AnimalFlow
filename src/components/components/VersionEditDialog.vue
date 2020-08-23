<template>
  <el-dialog
    class="segment-set"
    size="tiny"
    :title="title"
    :show-close=false
    :visible="visible"
  >
    <el-form :model="versionDetail" ref="versionForm" :label-position="labelPosition" :rules="rules" label-width="80px" >
      <el-form-item label="版本名称" prop="code">
        <el-input v-model="versionDetail.code"></el-input>
      </el-form-item>
      <el-form-item label="版本描述" prop="descri">
        <el-input type="textarea" v-model="versionDetail.descri"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok">确 定</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Validate from '../../../../scripts/validate-rules'
    export default {
      name: "VersionEditDialog",
      props: {
        title: {
          type: String,
          default: '版本编辑'
        },
        visible: {
          type: Boolean,
          default: false
        },
        versionData: {
          type: Object,
          default() {
            return {}
          }
        },
        versions: {
          type: Array,
          default() {
            return []
          }
        }
      },
      data() {
        let isRepeated = (rule, value, callback) => {
          if (this.versions.length>0) {
            let checkArray = _.map(this.versions, 'code')
            let originVersion = _.find(this.versions, {versionId: this.versionData.versionId})
            if (originVersion.code !== this.versionDetail.code) {
              checkArray.push(this.versionDetail.code)
            }

            if (checkArray.indexOf(value) === checkArray.lastIndexOf(value)) {
              callback();
            } else {
              callback(new Error('版本名不能重复'));
            }
          }
        }
        return {
         labelPosition: 'top',
         rules: {
           code: [...Validate.name, {validator: isRepeated, trigger: 'blur'}],
           descri: Validate.description
         },
         versionDetail: _.cloneDeep(this.versionData)
       }
     },
     created() {},
     methods: {
       ok () {
         this.$refs.versionForm.validate((validate) => {
           if (validate) {
             this.$emit('ok', this.versionDetail)
           }
         })
       },
       cancel () {
         this.$emit('cancel')
       }
      },
      watch: {
        versionData () {
          this.versionDetail = _.cloneDeep(this.versionData)
        }
      }
    }
</script>

<style scoped>

</style>
