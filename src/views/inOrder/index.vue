<template>
  <div class="app-container table-layout">
    <div class="left-table">
      <el-button class="pan-btn blue-btn" style="width:100%;margin-bottom:10px;" @click="loadingAllList">全部材料订单</el-button>
      <customer-list :list="customerList" @add="handleChoose"></customer-list>
    </div>
    <div class="right-table">
      <div class="filter-container">
        <el-button class="pan-btn tiffany-btn" @click="add">新建材料单</el-button>
        <el-date-picker v-model="queryList.searchDate" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd" :unlink-panels="true">
        </el-date-picker>
        <el-button type="primary" @click="loadingOrderList">查询</el-button>
      </div>
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="customerName" label="客户名称">
          <template slot-scope="scope">
            {{scope.row.customerName}}
          </template>
        </el-table-column>
        <el-table-column label="材料类型" prop="materialType">
        </el-table-column>
        <el-table-column label="交货日期">
          <template slot-scope="scope">
            {{ scope.row.receiptDate | timeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="总金额">
          <template slot-scope="scope">
            {{ '￥'+scope.row.totalAmount}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCheck(scope.row.id)">查看</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryList.currentPage" :page-sizes="[5,10,15]" :page-size="queryList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="queryList.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import customerList from '@/components/tables/customerList'
import { getCustomerListByType } from '@/api/customer'
import { getOrderByCustomerId, deleteOneOrder } from '@/api/inOrder'
import { parseTime } from '@/utils/index'
export default {
  name: 'order',
  components: {
    customerList
  },
  data() {
    return {
      customerList: [],
      currentCustomer: {},
      orderList: [],
      // 分页
      queryList: {
        currentPage: 1,
        total: 50,
        pageSize: 5,
        searchDate: ''
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
    }
  },
  methods: {
    loadingAllList() {
      this.currentCustomer = {}
      this.loadingOrderList()
    },
    loadingCustomerList() {
      const mp = { out: 1, in: 2 }
      getCustomerListByType({ type: mp['in'] }).then(response => {
        this.customerList = response.data
      })
    },
    add() {
      this.$router.push({ name: 'inBoard' })
    },
    loadingOrderList() {
      const form = {
        page: this.queryList.currentPage,
        size: this.queryList.pageSize,
        flag: '1',
        customerId: -1,
        startDate: this.queryList.searchDate ? this.queryList.searchDate[0] : '',
        endDate: this.queryList.searchDate ? this.queryList.searchDate[1] : ''
      }
      if (this.currentCustomer.id) {
        form.customerId = this.currentCustomer.id
      }
      getOrderByCustomerId(form).then(response => {
        this.orderList = response.data.list
        this.queryList.total = response.data.total
      })
    },
    handleChoose(row) {
      this.currentCustomer = row
      this.loadingOrderList()
    },
    handleCheck(id) {
      this.$router.push({ name: 'inBoard', query: { pageId: id }})
    },
    handleDelete(id) {
      this.$confirm('确定删除该订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        deleteOneOrder(id).then(() => {
          this.loadingOrderList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.queryList.currentPage = val
      this.loadingOrderList()
    },
    handleSizeChange(val) {
      this.queryList.pageSize = val
      this.loadingOrderList()
    }
  },
  mounted() {
    this.loadingCustomerList()
    this.loadingOrderList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.table-layout {
  display: flex;
  align-items: flex-start;
  .left-table {
    flex: 0 0 auto;
    height: 50px;
    width: 250px;
  }
  .right-table {
    flex: 1 0 auto;
    margin-left: 20px;
    height: 50px;
  }
  .filter-container {
    margin-bottom: 10px;
  }
}
</style>
