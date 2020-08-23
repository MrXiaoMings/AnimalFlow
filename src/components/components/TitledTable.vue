<template>
  <div class="titled-talbe">
    <el-row class="title-set">
      <el-col :span="24">{{title}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          ref="table"
          height="120"
          :data="tableContents"
          tooltip-effect="dark">
          <el-table-column
            v-for="col in tableHead"
            align="center"
            :prop="col.prop"
            :label="col.label"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "TitledTable",
    props: {
      title: {
        type: String,
        default: '标题'
      },
      tableHead: {
        type: Array,
        default() {
          return []
        }
      },
      tableContents: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style lang="scss">
.titled-talbe{
  .title-set{
    margin: 6px 0px;
  }
}
</style>
