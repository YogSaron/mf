<template>
  <div class="dashboard-container">
    <panel-group :customerList="customerList" @loadingBarTotalData="loadingBarTotalData"></panel-group>
    <el-row>
      <bar-chart :barData="barData"></bar-chart>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOutSumByMonth } from '@/api/integrate'
import { getCustomerListByType } from '@/api/customer'
import BarChart from './components/BarChart'
import PanelGroup from './components/PanelGroup'
export default {
  name: 'dashboard',
  components: {
    PanelGroup,
    BarChart
  },
  data() {
    return {
      barData: {},
      barTotalData: [],
      customerList: []
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  methods: {
    loadingBarTotalData(customer) {
      const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      const form = { targetYear: '2018' }
      if (customer) {
        form.customerId = customer.id
      }
      getOutSumByMonth(form).then(response => {
        const { data } = response
        for (const ob of data) {
          arr[ob.mon - 1] = ob.totalAmount
        }
        this.barData = Object.assign({}, { name: customer ? customer.customerName : '总额', list: arr })
      })
    },
    loadingCustomerList() {
      const mp = { out: 1, in: 2 }
      getCustomerListByType({ type: mp['out'] }).then(response => {
        this.customerList = response.data
      })
    }
  },
  mounted() {
    this.loadingBarTotalData()
    this.loadingCustomerList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
