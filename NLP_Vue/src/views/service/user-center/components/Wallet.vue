<template>
  <div>
    <el-row>
      <el-col :span="12">
        <h3>{{ "当前余额：￥"+wallet.money }}</h3>
        <el-button type="success">充值</el-button>
        <el-button type="primary">提现</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMoney } from '@/api/service/wallet'

export default {
  data() {
    return {
      wallet: {
        money: 100.0
      }
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      console.log(this.username)

      getMoney({ 'username': this.username }).then(response => {
        this.wallet.money = response.data.money
      })
    }
  }
}
</script>
