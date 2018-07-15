<template>
  <div class="app-container table-layout">
    <div class="left-table">

      <div class="filter-container">
        <el-button class="pan-btn tiffany-btn" size="mini" @click="addCustomer('customerForm')">添加客户</el-button>
      </div>
      <el-tabs v-model="tabName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="出货客户" name="out">
          <customer-list :list="customerList" @add="chooseCustomer" mold="management" @rowEdit="handleRowEdit" @rowDel="handleRowDel"></customer-list>
        </el-tab-pane>
        <el-tab-pane label="采购客户" name="in">
          <customer-list :list="customerList" @add="chooseCustomer" mold="management" @rowEdit="handleRowEdit" @rowDel="handleRowDel"></customer-list>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="right-table">
      <div class="filter-container">
        <div class="customer-label">
          <mallki className="mallki-text" :text="'当前客户名称：'+currentRow.customerName" style="line-height:35px;"></mallki>
        </div>
        <el-button class="pan-btn tiffany-btn" @click="addProduct('productForm')">添加产品</el-button>
      </div>
      <el-table :data="currentProductList" border>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="model" label="产品型号">
        </el-table-column>
        <el-table-column prop="packaging" label="包装">
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价">
        </el-table-column>
        <el-table-column align="center" label="操作" width="130" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)" round></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)" round>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="客户添加" :visible.sync="dialogVisible" width="360px">
      <el-form :model="form" ref="customerForm" label-width="80px" label-position="left">
        <el-form-item label="客户类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">出货客户</el-radio>
            <el-radio :label="2">材料客户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cusSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 产品弹窗 -->
    <el-dialog title="产品添加" :visible.sync="dialogVisible2" width="360px">
      <el-form :model="productForm" ref="productForm" label-width="80px" label-position="left">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="currentRow.customerName" auto-complete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="productForm.model" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="包装" prop="packaging">
          <el-input v-model="productForm.packaging" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input v-model="productForm.unitPrice" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="proSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCustomerListByType,
  addCustomer,
  getProductListByParentId,
  addProduct,
  delCustomer,
  updateCustomer,
  deleteProduct,
  updateProduct
} from '@/api/customer'
import mallki from '@/components/effects/Mallki'
import customerList from '@/components/tables/customerList'
export default {
  name: 'customer',
  components: {
    customerList,
    mallki
  },
  data() {
    return {
      tabName: 'out',
      customerList: [],
      currentProductList: [],
      productList: [],
      currentRow: {
        id: '',
        customerName: ''
      },
      form: {
        customerName: '',
        address: '',
        mobile: '',
        type: 1
      },
      productForm: {
        model: '',
        packaging: '',
        unitPrice: ''
      },
      dialogVisible: false,
      dialogVisible2: false
    }
  },
  methods: {
    handleClick(tab, event) {
      this.tabName = tab.name
      this.loadingCustomerList()
    },
    addCustomer(customerForm) {
      this.dialogVisible = true
      this.$refs[customerForm].resetFields()
    },
    handleRowEdit(row) {
      this.form = row
      this.dialogVisible = true
    },
    handleRowDel(rid) {
      this.$confirm('确定删除该客户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        delCustomer(rid).then(() => {
          this.loadingCustomerList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    chooseCustomer(row) {
      // this.currentProductList = this.productList.filter(item => {
      //   return item.customerName === row.customerName
      // })
      this.currentRow = row
      getProductListByParentId(row.id).then(response => {
        this.currentProductList = response.data
      })
    },
    cusSubmit() {
      if (this.form.createTime) {
        delete this.form.createTime
      }
      if (this.form.id) {
        updateCustomer(this.form).then(response => {
          this.$message({ type: 'success', message: '更新成功' })
          this.dialogVisible = false
          this.loadingCustomerList()
        })
      } else {
        addCustomer(this.form).then(response => {
          this.$message({ type: 'success', message: '提交成功' })
          this.dialogVisible = false
          this.loadingCustomerList()
        })
      }
    },
    proSubmit() {
      this.productForm.parentId = this.currentRow.id
      if (this.productForm.id) {
        updateProduct(this.productForm).then(response => {
          this.$message({ type: 'success', message: '保存成功' })
          this.dialogVisible2 = false
          this.chooseCustomer(this.currentRow)
        })
      } else {
        addProduct(this.productForm).then(response => {
          this.$message({ type: 'success', message: '保存成功' })
          this.dialogVisible2 = false
          this.chooseCustomer(this.currentRow)
        })
      }
    },
    handleEdit(row) {
      this.productForm = row
      this.dialogVisible2 = true
    },
    handleDelete(pid) {
      this.$confirm('确定删除该产品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        deleteProduct(pid).then(() => {
          this.chooseCustomer(this.currentRow)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    loadingCustomerList() {
      const mp = { out: 1, in: 2 }
      getCustomerListByType({ type: mp[this.tabName] }).then(response => {
        this.customerList = response.data
      })
    },
    addProduct(productForm) {
      if (!this.currentRow.id) {
        this.$message({ type: 'warning', message: '请先选择一个客户' })
        return
      }
      this.dialogVisible2 = true
      this.$refs[productForm].resetFields()
    }
  },
  mounted() {
    this.loadingCustomerList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.table-layout {
  display: flex;
  align-items: flex-start;
  height: 100%;
  .left-table {
    flex: 0 0 auto;
    width: 350px;
  }
  .right-table {
    flex: 1 0 auto;
    margin-left: 20px;
  }
  .filter-container {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    .customer-label {
      margin-right: auto;
    }
  }
}
</style>
