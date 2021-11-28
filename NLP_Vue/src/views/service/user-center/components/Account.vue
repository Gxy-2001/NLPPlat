<template>
  <el-form :model="userInfo">
    <el-form-item label="姓名">
      <el-input v-model.trim="userInfo.name" />
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model.trim="userInfo.phone" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="userInfo.email" />
    </el-form-item>
    <el-form-item label="个人介绍">
      <el-input v-model="userInfo.introduction" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新信息</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllInfo, modifyInfo } from '@/api/service/user'

export default {
  data() {
    return {
      userInfo: {
        username: '',
        name: '',
        phone: '',
        email: '',
        introduction: ''
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getAllInfo().then(response => {
        for (var key in this.userInfo) {
          this.userInfo[key] = response.data[key]
        }
      })
    },
    submit() {
      modifyInfo(this.userInfo).then(response => {
        this.$message.success('个人信息修改成功！')
        this.getUser()
      })
    }
  }
}
</script>
