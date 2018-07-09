<template>
    <div class="app-container">
        <div class="order-form">
            <h2>客户名</h2>
            <el-row :gutter="10">
                <el-col :span="3">客户名：</el-col>
                <el-col :span="8">
                    <el-select v-model="orderForm.customerId">
                        <el-option v-for="item in mockOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="3">收货地:</el-col>
                <el-col :span="8">
                    <el-input type="textarea" :rows="3" v-model="orderForm.deliveryAddress"></el-input>
                </el-col>
                <el-col :span="3">发货日期:</el-col>
                <el-col :span="8">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="orderForm.deliveryDate"></el-date-picker>
                </el-col>
            </el-row>
            <div class="parting-line"></div>
            <el-row>
                <el-col :span="12">
                    <el-button type="primary" icon="el-icon-plus"></el-button>
                </el-col>
            </el-row>
            <el-row :gutter="5" v-for="(item,index) in goodsList">
                <el-col :span="2">型号：</el-col>
                <el-col :span="3">
                    <el-select v-model="item.model">
                        <el-option v-for="item in mockOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">包装：</el-col>
                <el-col :span="3">
                    <el-select v-model="item.package">
                        <el-option v-for="item in mockOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">数量</el-col>
                <el-col :span="3">
                    <el-input placeholder="数量" v-model="item.number"></el-input>
                </el-col>
                <el-col :span="2">单价：</el-col>
                <el-col :span="3">
                    <el-input placeholder="单价" v-model="item.unitPrice"></el-input>
                </el-col>
                <el-col :span="2">总价：</el-col>
                <el-col :span="2">{{item.totalAmount}}</el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="4" :offset="8">
                    <el-button type="primary">提交</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button @click="goBack">返回</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      mockOptions: ['juzi', 'fengli'],
      orderForm: {
        customerId: '',
        deliveryAddress: '',
        deliveryDate: ''
      },
      goodsList: [
        {
          model: 'HD091',
          package: 'djlkal',
          number: '50',
          unitPrice: 500,
          totalAmount: 25000
        },
        {
          model: 'HD091',
          package: 'djlkal',
          number: '50',
          unitPrice: 500,
          totalAmount: 25000
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-form {
  margin: 0 auto;
  width: 800px;
  padding: 10px;
  border: 1px solid #474747;
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
</style>
