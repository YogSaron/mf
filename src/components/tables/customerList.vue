<template>
  <el-table highlight-current-row :data="list" @row-click="handleRowClick" style="width: 100%">
    <el-table-column type="index" width="100">
    </el-table-column>
    <el-table-column prop="customerName" label="客户名称" width="100">
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    list: {
      type: Array
    }
  },
  methods: {
    handleRowClick(row, event, column) {
      this.$emit('add', row)
    }
  }
}
</script>
    
    
