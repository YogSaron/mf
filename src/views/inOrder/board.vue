<template>
  <div class="app-container">
    <div class="order-form">
      <h2>明发材料采购单</h2>
      <el-row :gutter="10">
        <el-col :span="3">
          <label class="label-controller">客户名：</label>
        </el-col>
        <el-col :span="8">
          <el-select v-model="orderForm.customerId" filterable clearable @change="handleSelect" :disabled="isRead">
            <el-option v-for="item in customerList" :key="item.id" :label="item.customerName" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <label class="label-controller">材料类型</label>
        </el-col>
        <el-col :span="9">
          <el-input class="input-controller" v-model="orderForm.materialType" resize="none" :readonly="isRead"></el-input>
        </el-col>
        <el-col :span="3">
          <label class="label-controller">收货日期：</label>
        </el-col>
        <el-col :span="9">
          <el-date-picker type="date" format="yyyy-MM-dd" value-format="timestamp" v-model="orderForm.receiptDate" :readonly="isRead"></el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <label class="label-controller">总金额：</label>
        </el-col>
        <el-col :span="9">
          <el-input v-model="accountPayable" class="input-controller" :readonly="isRead">
            <template slot="append">元</template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <label class="label-controller">备注：</label>
        </el-col>
        <el-col :span="9">
          <el-input type="textarea" v-model="orderForm.remark" :rows="3" class="input-controller" resize="none" :readonly="isRead">
          </el-input>
        </el-col>
      </el-row>
      <div class="parting-line"></div>
      <el-button v-if="!isRead" type="primary" icon="el-icon-plus" size="mini" style="margin-bottom:10px;" @click="handleAdd('goodsDetail')">添加</el-button>
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
              <el-button v-if="!isRead" type="primary" size="mini" @click="handleUpdate(scope.row,scope.$index)">编辑</el-button>
              <el-button v-if="!isRead" size="mini" type="danger" @click="handleDelete(scope.$index,goodsList)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4" :offset="8">
          <el-button v-if="!isRead" type="primary" @click="submit">提交</el-button>
          <el-button v-else type="warning" @click="pageEdit">编辑</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="goBack">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="添加" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="goodsDetail" label-width="70px" label-position="left" style='width: 400px; margin-left:50px;'>
        <el-form-item label="型号" :prop="goodsDetail.model">
          <el-select class="filter-item input-controller" placeholder="请选择型号" v-model="goodsDetail.model" @change="handleModelSelect" filterable>
            <el-option v-for="item in  productList" :key="item.id" :label="item.model" :value="item.model">
            </el-option>
          </el-select>
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
import { orderSave, getEntireOrderById, entireOrderUpdate } from '@/api/inOrder'
// import { partialAssign } from '@/utils/index'
export default {
  data() {
    return {
      dialogFormVisible: false,
      pageId: '',
      isRead: false,
      customerList: [],
      productList: [], // 下拉选的list
      orderForm: {
        id: '',
        customerId: '',
        customerName: '',
        receiptAddress: '',
        receiptDate: '',
        materialType: [],
        accountPayable: 0,
        remark: '',
        totalAmount: 0
      },
      goodsDetail: {
        model: '',
        packaging: '',
        quantity: '',
        unitPrice: 0,
        aggregate: '',
        index: ''
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
    pageEdit() {
      this.isRead = false
      getProductListByParentId(this.orderForm.customerId).then(response => {
        this.productList = response.data
      })
    },
    handleSelect(val) {
      const customer = this.customerList.find(obj => {
        return obj.id === val
      })
      // this.orderForm.deliveryAddress = customer.address
      this.orderForm.customerId = customer.id
      this.orderForm.customerName = customer.customerName
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
      this.orderForm.materialType.push(product.materialType)
      this.orderForm.materialType = Array.from(new Set(this.orderForm.materialType))
    },
    // 确认添加
    addRow() {
      this.goodsDetail.aggregate = this.aggregate
      if (this.goodsDetail.index) {
        this.goodsList.splice(this.goodsDetail.index, 1)
      }
      this.goodsList.push(Object.assign({}, this.goodsDetail))
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
    // 商品编辑
    handleUpdate(row, index) {
      this.goodsDetail = row
      this.goodsDetail.index = index
      console.log(this.goodsDetail)
      this.dialogFormVisible = true
    },
    // 商品删除
    handleDelete(index, rows) {
      rows.splice(index, 1)
    },
    loadingCustomerList() {
      getCustomerListByType({ type: 2 }).then(response => {
        this.customerList = response.data
      })
    },
    loadingEntireOrder(pageId) {
      getEntireOrderById(pageId).then(response => {
        const { data } = response
        this.goodsList = JSON.parse(data.goodsList)
        this.orderForm = JSON.parse(data.order)
      })
    },
    submit() {
      if (!this.orderForm.receiptDate) {
        this.$message({ message: '请选择收货时间', type: 'warning' })
        return
      }
      if (!this.orderForm.customerId) {
        this.$message({ message: '请选择客户', type: 'warning' })
        return
      }
      this.orderForm.totalAmount = this.accountPayable
      if (this.pageId) {
        this.orderForm.id = this.pageId
        const form = {
          goodsList: JSON.stringify(this.goodsList),
          sysInOrder: JSON.stringify(this.orderForm)
        }
        entireOrderUpdate(form).then(response => {
          this.$message({ message: '更新成功', type: 'success' })
          this.goBack()
        })
      } else {
        const form = {
          goodsList: JSON.stringify(this.goodsList),
          sysInOrder: JSON.stringify(this.orderForm)
        }
        orderSave(form).then(response => {
          this.$message({ message: '保存成功', type: 'success' })
          this.goBack()
        })
      }
    }
  },
  mounted() {
    this.loadingCustomerList()
    this.pageId = this.$route.query.pageId
    if (this.pageId) {
      this.isRead = true
      this.loadingEntireOrder(this.pageId)
      getProductListByParentId(this.customer.id).then(response => {
        this.productList = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-form {
  margin: 0 auto;
  width: 1000px;
  padding: 20px;
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
.label-controller {
  width: 100%;
  text-align: right;
  display: block;
  margin-top: 5px;
}
</style>
