<template>
  <div class="table-container">
    <el-table highlight-current-row :data="list" @row-click="handleRowClick" style="width: 100%" @current-change="handleChange" row-class-name="row-style">
      <el-table-column type="index" width="100" align="center">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称">
      </el-table-column>
      <el-table-column v-if="mold=='management'" align="center" label="操作" width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)" round></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)" round>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array
    },
    mold: String
  },
  data() {
    return {
      currentRow: {}
    }
  },
  methods: {
    handleRowClick(row, event, column) {
      this.$emit('add', row)
    },
    handleChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow
    },
    handleEdit(row) {
      this.$emit('rowEdit', row)
    },
    handleDelete(rid) {
      this.$emit('rowDel', rid)
    }
  }
}
</script>
    <style lang="scss" scoped>
.table-container {
  background: #fff;
  border: 1px solid #dcdfe6;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
    
    
