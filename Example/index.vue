<template>
  <!-- 使用 useVirtual 属性开启虚拟滚动 使用虚拟滚动时，必须要固定表格高度和行高 -->
  <!-- 1. 使用格式外层必须包含一层父级元素，且必须设置高度 2. this.$refs.plTable.setHeight() // 当窗口高度变化或者外层高度变化，就调用该方法 -->
  <div style="height: 500px">
    <!--<pl-table :datas="tableData" height="400" useVirtual
    注意点： 表格插件并不需要height属性字段(跟ele不同)，因为涉及分页组件。里面会去计算高度，只需要父级外层设置高度即可
    row-height属性很重要 请看表格属性列表
    -->
    <pl-table :datas="tableData" :use-virtual="true" :row-height="54">
      <el-table-column
        type="index"
        width="100"
        fixed
      ></el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </pl-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: []
      }
    },
    mounted () {
      this.tableData =  Array.from({length: 10000}, () => ({
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }))
    }
  }
</script>
