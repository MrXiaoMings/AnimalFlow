<template>
  <div>
    <table align="center" border="1">
      <tr style="background: #EDF2F7;height: 40px">
        <template v-for="(tabName) in tableHead">
          <th style="width: 20%">{{tabName}}</th>
        </template>
      </tr>
      <template v-for="(value, key) in detailResult">
        <template v-for=" (item, index) in value">
          <tr style="height: 40px;">
            <template v-if="index==0">
              <td :rowspan="value.length" style="padding-left: 20px; border-bottom: 1px solid rgba(237, 237, 237, 1)">
                {{key}}
              </td>
            </template>
            <td style="border-bottom: 1px solid rgba(237, 237, 237, 1)">
              {{item.name}}
            </td>
            <template slot-scope="scope">
              <el-select v-model="item.field" placeholder="请选择">
                <el-option
                  v-for="each in item.options"
                  :key="each.value"
                  :label="each.label"
                  :value="each.value">
                </el-option>
              </el-select>
            </template>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>
<script>
  export default ({
    name: 'SetParamsTable',
    props: {
      detailResult: {
        type: Object,
        default: {}
      },
      tableHead: {
        type: Array,
        default: []
      }
    }
  })
</script>
<style lang="scss">
  table {
    border-color: rgba(237, 237, 237, 0.3);
    font-size: 14px;
    margin: 0;
    padding: 0;
    width: 100%;
    -webkit-border-horizontal-spacing: 0px;
    -webkit-border-vertical-spacing: 0px;
    text-align: center;
  }
</style>
