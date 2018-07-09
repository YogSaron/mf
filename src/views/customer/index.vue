<template>
  <div class="app-container table-layout">
    <div class="left-table">

      <div class="filter-container">
        <el-button type="primary" size="small" @click="addCustomer('customerForm')">添加</el-button>
        <el-button type="success" size="small" @click="editCustomer('customerForm')">修改</el-button>
        <el-button type="danger" size="small" @click="delCustomer('customerForm')">删除</el-button>
      </div>
      <customer-list :list="customerList" @add="chooseCustomer"></customer-list>
    </div>

    <div class="right-table">
      <div class="filter-container">
        <el-button type="primary" size="small" @click="addProduct('customerForm')">添加</el-button>
        <el-button type="success" size="small" @click="editProduct('customerForm')">修改</el-button>
        <el-button type="success" size="small" @click="deleteProduct('customerForm')">删除</el-button>
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
      </el-table>
    </div>
    <el-dialog title="客户添加" :visible.sync="dialogVisible" width="360px">
      <el-form :model="form" ref="customerForm" label-width="80px" label-position="left">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" auto-complete="off"></el-input>
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
    <el-dialog title="产品添加" :visible.sync="dialogVisible2" width="360px">
      <el-form :model="form" ref="customerForm" label-width="80px" label-position="left">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" auto-complete="off"></el-input>
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
  </div>
</template>
<script>
import { getCustomerList, addCustomer } from '@/api/customer'
import customerList from '@/components/tables/customerList'
export default {
  name: 'customer',
  components: {
    customerList
  },
  data() {
    return {
      customerList: [],
      currentProductList: [],
      productList: [
        { customerName: '张三', model: 'X1', package: '白盒', unitPrice: '20' },
        { customerName: '李四', model: 'H1', package: '彩盒', unitPrice: '50' }
      ],
      form: {
        customerName: '',
        address: '',
        tel: '',
        mobile: '',
        type: 1
      },
      dialogVisible: false
    }
  },
  methods: {
    addCustomer(customerForm) {
      this.dialogVisible = true
      this.$refs[customerForm].resetFields()
    },
    chooseCustomer(row) {
      this.currentProductList = this.productList.filter(item => {
        return item.customerName === row.customerName
      })
    },
    cusSubmit() {
      addCustomer(this.form).then(response => {
        this.$message('提交成功')
        this.dialogVisible = false
        this.loadingCustomerList()
      })
    },
    loadingCustomerList() {
      getCustomerList().then(response => {
        this.customerList = response.data.list
      })
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
  height:100%;
  .left-table {
    flex: 0 0 auto;
    height: 50px;
    width: 250px;
  }
  .right-table {
    flex: 0 0 auto;
    margin-left: 20px;
    height: 50px;
    width: 100%;
  }
  .filter-container {
    margin-bottom: 10px;
  }
}
</style>
