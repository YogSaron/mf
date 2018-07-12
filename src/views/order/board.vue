<template>
    <div class="app-container">
        <div class="order-form">
            <h2>客户名</h2>
            <el-row :gutter="10">
                <el-col :span="3">客户名：</el-col>
                <el-col :span="8">
                    <el-select v-model="orderForm.customerId" filterable clearable @change="handleSelect">
                        <el-option v-for="item in customerList" :key="item.id" :label="item.customerName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="3">收货地：</el-col>
                <el-col :span="9">
                    <el-input type="textarea" :rows="3" v-model="orderForm.deliveryAddress" resize="none"></el-input>
                </el-col>
                <el-col :span="3">发货日期:</el-col>
                <el-col :span="9">
                    <el-date-picker type="date" format="yyyy-MM-dd" value-format="timestamp" v-model="orderForm.deliveryDate"></el-date-picker>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="3">总金额：</el-col>
                <el-col :span="9">
                    <el-input v-model="accountPayable" class="input-controller">
                        <template slot="append">元</template>
                    </el-input>
                </el-col>
                <el-col :span="3">应付款</el-col>
                <el-col :span="9">
                    <el-input v-model="accountPayable" class="input-controller">
                        <template slot="append">元</template>
                    </el-input>
                </el-col>
            </el-row>
            <div class="parting-line"></div>
            <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-bottom:10px;" @click="handleAdd('goodsDetail')">添加</el-button>
            <el-row :span="24">
                <el-table :data="goodsList" border style="width: 100%" show-summary>
                    <el-table-column prop="model" label="型号">
                    </el-table-column>
                    <el-table-column prop="packaging" label="包装">
                    </el-table-column>
                    <el-table-column prop="quantity" label="数量">
                    </el-table-column>
                    <el-table-column prop="unitPrice" label="单价">
                    </el-table-column>
                    <el-table-column prop="aggregate" label="金额">
                    </el-table-column>
                    <el-table-column align="center" width="160" label="操作" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index,goodsList)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="4" :offset="8">
                    <el-button type="primary" @click="submit">提交</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button @click="goBack">返回</el-button>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="添加" :visible.sync="dialogFormVisible" width="500px">
            <el-form ref="goodsDetail" label-width="70px" label-position="left" style='width: 400px; margin-left:50px;'>
                <el-form-item label="型号" :prop="goodsDetail.model">
                    <el-select class="filter-item input-controller" v-model="goodsDetail.model" placeholder="Please select" @change="handleModelSelect" filterable>
                        <el-option v-for="item in  productList" :key="item.id" :label="item.model" :value="item.model">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="包装" prop="packaging">
                    <el-input v-model="goodsDetail.packaging" class="input-controller"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="quantity">
                    <el-input v-model="goodsDetail.quantity" class="input-controller"></el-input>
                </el-form-item>
                <el-form-item label="单价" prop="unitPrice">
                    <el-input v-model.number="goodsDetail.unitPrice" class="input-controller">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="金额" prop="aggregate">
                    <el-input v-model.number="aggregate" class="input-controller">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRow">确定</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getCustomerListByType, getProductListByParentId } from '@/api/customer'
import { orderSave } from '@/api/order'
export default {
  data() {
    return {
      dialogFormVisible: false,
      customerList: [],
      productList: [], // 下拉选的list
      orderForm: {
        customerId: '',
        deliveryAddress: '',
        deliveryDate: '',
        accountPayable: 0,
        remark: '',
        totalAmount: 0
      },
      goodsDetail: {
        model: '',
        packaging: '',
        quantity: '',
        unitPrice: 0,
        aggregate: ''
      },
      goodsList: [] // 订单的型号
    }
  },
  computed: {
    aggregate() {
      return this.goodsDetail.quantity * this.goodsDetail.unitPrice
    },
    accountPayable() {
      let sum = 0
      for (const obj of this.goodsList) {
        sum += obj.aggregate
      }
      return sum
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSelect(val) {
      const customer = this.customerList.find(obj => {
        return obj.id === val
      })
      this.orderForm.deliveryAddress = customer.address
      this.orderForm.customerId = customer.id
      getProductListByParentId(customer.id).then(response => {
        this.productList = response.data
      })
    },
    handleModelSelect(val) {
      const product = this.productList.find(obj => {
        return obj.model === val
      })
      this.goodsDetail.packaging = product.packaging
      this.goodsDetail.unitPrice = product.unitPrice
    },
    addRow() {
      this.goodsDetail.aggregate = this.aggregate
      this.goodsList.push(Object.assign([], this.goodsDetail))
      this.dialogFormVisible = false
    },
    handleAdd(formName) {
      if (!this.orderForm.customerId) {
        this.$message({ message: '请先选择客户！', type: 'warning' })
        return
      }
      this.dialogFormVisible = true
      for (const key in this.goodsDetail) {
        this.goodsDetail[key] = ''
      }
    },
    handleUpdate() {
      this.dialogFormVisible = true
    },
    handleDelete(index, rows) {
      rows.splice(index, 1)
    },
    loadingCustomerList() {
      getCustomerListByType({ type: 1 }).then(response => {
        this.customerList = response.data
      })
    },
    submit() {
      // let flag = false
      // for (const key in this.orderForm) {
      //   if (!this.orderForm[key]) {
      //     flag = true
      //     return
      //   }
      // }
      // if (flag) {
      //   this.$message({ message: '请完善订单信息！', type: 'warning' })
      //   return
      // }
      const form = { goodsList: JSON.stringify(this.goodsList), sysOutOrder: this.orderForm }
      orderSave(form).then(response => {
        this.$message({ message: '保存成功', type: 'success' })
      })
    }
  },
  mounted() {
    this.loadingCustomerList()
  }
}
</script>

<style lang="scss" scoped>
.order-form {
  margin: 0 auto;
  width: 1000px;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  .parting-line {
    width: 100%;
    height: 0;
    border-bottom: 1px dashed #474747;
    margin: 10px 0;
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.input-controller {
  width: 230px;
}
</style>
