<template>
  <div class="app-container table-layout">
    <div class="left-table">
      <el-tabs v-model="tabName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="出货客户" name="out">
          <customer-list :list="customerList" @add="chooseCustomer"></customer-list>
        </el-tab-pane>
        <el-tab-pane label="采购客户" name="in">
          <customer-list :list="customerList" @add="chooseCustomer"></customer-list>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-table">
      <div class="filter-container">
        <el-button class="pan-btn tiffany-btn" @click="add('paym')">添加收款</el-button>
        <el-date-picker v-model="queryList.searchDate" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd" :unlink-panels="true">
        </el-date-picker>
        <el-button type="primary" @click="loadingOrderList">查询</el-button>
        <div class="sum">
          <div class="sum-title">{{currentCustomer.customerName?currentCustomer.customerName:'所有客户'}}：总计货款</div>
          <div class="sum-text">
            <svg-icon icon-class="money" />
            <count-to class="card-panel-num" :startVal="0" :endVal="sumAmount" :duration="1000"></count-to>
          </div>
        </div>
      </div>
      <el-table :data="paymentList" border>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称">
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交付时间" v-if="tabName == 'out'">
          <template slot-scope="scope">
            {{ scope.row.deliveryDate | timeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交付时间" v-else>
          <template slot-scope="scope">
            {{ scope.row.receiptDate | timeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-tag :type="scope.row.flag | tagColor">{{ scope.row.flag | paymentType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">
            {{ '￥' + scope.row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="handleCheck(scope.row.id)" round>查看</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)" round>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryList.currentPage" :page-sizes="[5,10,15]" :page-size="queryList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="queryList.total">
        </el-pagination>
      </div>
      <el-dialog title="收款" :visible.sync="dialogVisible" width="360px">
        <el-form :model="payForm" ref="paym" label-width="80px" label-position="left">
          <el-form-item label="当前客户">
            {{currentCustomer.customerName}}
          </el-form-item>
          <el-form-item label="金额" prop="totalAmount">
            <el-input v-model="payForm.totalAmount" auto-complete="off" style="width:220px;">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="收款日期" prop="deliveryDate" v-if="this.tabName == 'out'">
            <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="payForm.deliveryDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="付款日期" prop="receiptDate" v-else>
            <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="payForm.receiptDate"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import customerList from '@/components/tables/customerList'
import { getCustomerListByType } from '@/api/customer'
import { getOrderByCustomerId, getSumAmount } from '@/api/order'
import {
  getOrderByCustomerId as getInOrderByCustomerId,
  getSumAmount as getInSumAmount
} from '@/api/inOrder'
import { outPaymentSave, inPaymentSave } from '@/api/payment'
import { parseTime } from '@/utils/index'
import CountTo from 'vue-count-to'
export default {
  components: {
    customerList,
    CountTo
  },
  data() {
    return {
      tabName: 'out',
      dialogVisible: false,
      customerList: [],
      paymentList: [],
      sumAmount: '',
      currentCustomer: {
        id: '',
        customerName: ''
      },
      queryList: {
        currentPage: 1,
        total: 50,
        pageSize: 5,
        searchDate: ''
      },
      payForm: {
        payType: 1,
        customerId: '',
        customerName: '',
        totalAmount: '',
        deliveryDate: '',
        receiptDate: ''
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  filters: {
    timeFilter: function(value) {
      if (value) {
        return parseTime(value, '{y}-{m}-{d}')
      } else {
        return ''
      }
    },
    paymentType: function(value) {
      const mp = { 1: '货款', 2: '收款' }
      return mp[value]
    },
    tagColor: function(value) {
      const mp = { 1: 'warning', 2: 'primary' }
      return mp[value]
    }
  },
  methods: {
    add(formName) {
      if (!this.currentCustomer.customerName) {
        this.$message({ type: 'warning', message: '请先选择一个客户！' })
        return
      }
      this.dialogVisible = true
      this.payForm.customerId = ''
      this.payForm.customerName = ''
      this.payForm.deliveryDate = ''
      this.payForm.totalAmount = ''
    },
    submit() {
      if (!this.payForm.totalAmount) {
        this.$message({ type: 'warning', message: '请输入收款金额！' })
        return
      }
      if (!this.payForm.deliveryDate & !this.payForm.receiptDate) {
        this.$message({ type: 'warning', message: '请输入日期！' })
        return
      }
      this.payForm.customerId = this.currentCustomer.id
      this.payForm.customerName = this.currentCustomer.customerName
      if (this.tabName === 'out') {
        outPaymentSave(this.payForm).then(response => {
          this.dialogVisible = false
          this.loadingOrderList()
          this.$message({ type: 'success', message: '保存成功' })
        })
      } else {
        inPaymentSave(this.payForm).then(response => {
          this.dialogVisible = false
          this.loadingOrderList()
          this.$message({ type: 'success', message: '保存成功' })
        })
      }
    },
    loadingCustomerList() {
      const mp = { out: 1, in: 2 }
      getCustomerListByType({ type: mp[this.tabName] }).then(response => {
        this.customerList = response.data
      })
    },
    handleClick(tab, event) {
      this.tabName = tab.name
      this.currentCustomer = {}
      this.loadingCustomerList()
    },
    chooseCustomer(row) {
      this.currentCustomer = row
      this.loadingOrderList()
    },
    loadingOrderList() {
      const form = {
        page: this.queryList.currentPage,
        size: this.queryList.pageSize,
        customerId: -1,
        startDate: this.queryList.searchDate
          ? this.queryList.searchDate[0]
          : '',
        endDate: this.queryList.searchDate ? this.queryList.searchDate[1] : ''
      }
      if (this.currentCustomer.id) {
        form.customerId = this.currentCustomer.id
      }

      if (this.tabName === 'out') {
        getOrderByCustomerId(form).then(response => {
          this.paymentList = response.data.list
          this.queryList.total = response.data.total
        })
        getSumAmount(form).then(response => {
          this.sumAmount = response.data
        })
      } else {
        getInOrderByCustomerId(form).then(response => {
          this.paymentList = response.data.list
          this.queryList.total = response.data.total
        })
        getInSumAmount(form).then(response => {
          this.sumAmount = response.data
        })
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.queryList.currentPage = val
      this.loadingOrderList()
    },
    handleSizeChange(val) {
      this.queryList.pageSize = val
      this.loadingOrderList()
    },
    handleCheck(pid) {
      this.$router.push({ name: 'board', query: { pageId: pid }})
    }
  },
  mounted() {
    this.loadingCustomerList()
    this.loadingOrderList()
  }
}
</script>

<style lang="scss" scoped>
.table-layout {
  display: flex;
  align-items: flex-start;
  height: 100%;
  .left-table {
    flex: 0 0 auto;
    width: 250px;
  }
  .right-table {
    flex: 1 0 auto;
    margin-left: 20px;
  }
  .filter-container {
    margin-bottom: 10px;
  }
}
.card-panel-num {
  font-size: 20px;
}

.sum {
  display: flex;
  .sum-title {
    padding: 9px;
  }
  .sum-text {
    padding: 5px;
  }
}
</style>
