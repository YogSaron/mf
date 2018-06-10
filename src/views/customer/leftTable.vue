<template>
        <el-table
    highlight-current-row
    :data="customerList"
    @row-click="chooseCustomer"
      style="width: 100%">
      <el-table-column
        type="index"
        width="100">
      </el-table-column>
      <el-table-column prop="customerName"
        label="客户名称"
        width="100">
      </el-table-column>
    </el-table>
</template>
<script>
export default {
  name: 'leftTable',
  prop: {
    customerList: {
      type: Array
    }
  },
  methods: {}
}
</script>
