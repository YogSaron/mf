<template>
  <div class="app-container table-layout">
    <div class="left-table">
      <customer-list :list="customerList"></customer-list>
    </div>
    <div class="right-table">
      <el-button type="primary" @click="add">新建订单</el-button>
      <el-table :data="tableData3" border style="width: 100%">
        <el-table-column prop="customerName" label="客户名称">
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交货日期">
        </el-table-column>
        <el-table-column prop="deliveryAddress" label="地址">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import customerList from '@/components/tables/customerList'
import { getCustomerListByType } from '@/api/customer'
export default {
  name: 'order',
  components: {
    customerList
  },
  data() {
    return {
      customerList: [],
      orderList: [
        {
          customerName: '张三',
          deliveryDate: '2018-05-01',
          deliveryAddress: '新城路41号'
        },
        {
          customerName: '张三',
          deliveryDate: '2018-05-02',
          deliveryAddress: '新城路41号'
        },
        {
          customerName: '张三',
          deliveryDate: '2018-05-55',
          deliveryAddress: '新城路41号'
        }
      ]
    }
  },
  methods: {
    loadingCustomerList() {
      const mp = { out: 1, in: 2 }
      getCustomerListByType({ type: mp['out'] }).then(response => {
        this.customerList = response.data
      })
    },
    add() {
      this.$router.push({ name: 'board' })
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
