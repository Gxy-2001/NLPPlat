<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人信息" name="个人信息">
                <account />
              </el-tab-pane>
              <el-tab-pane label="我的钱包" name="我的钱包">
                <wallet />
              </el-tab-pane>
              <el-tab-pane label="操作记录" name="操作记录">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="个人博客" name="个人博客">
                <activity />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import Wallet from './components/Wallet'

import { getAllInfo } from '@/api/service/user'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account, Wallet },
  data() {
    return {
      user: {},
      activeTab: '个人信息'
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        username: this.username,
        role: this.roles.join(' | '),
        avatar: this.avatar
      }
      getAllInfo().then(response => {
        Object.assign(this.user, response.data)
      })
    }
  }
}
</script>
