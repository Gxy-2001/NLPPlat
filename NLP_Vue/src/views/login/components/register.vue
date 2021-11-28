<template>
  <div>
    <el-row>
      <el-col :span="15" :offset="1">

        <el-form ref="RegisterFormRef" :model="RegisterForm" :rules="RegisterFormRules" label-width="10px" class="Register_form">
          <!--                用户名-->
          <el-form-item prop="username">
            <el-input v-model="RegisterForm.username" prefix-icon="el-icon-user-solid" placeholder="用户名" />
          </el-form-item>
          <!--                密码-->
          <el-form-item prop="password">
            <el-input v-model="RegisterForm.password" prefix-icon="el-icon-lock" type="password" placeholder="密码" />
          </el-form-item>
          <!--                二次确认密码-->
          <el-form-item prop="doubleCheck">
            <el-input v-model="RegisterForm.doubleCheck" prefix-icon="el-icon-lock" type="password" placeholder="确认密码" />
          </el-form-item>
          <!--                姓名-->
          <el-form-item prop="name">
            <el-input v-model="RegisterForm.name" prefix-icon="el-icon-user-solid" placeholder="姓名" />
          </el-form-item>

        </el-form>
      </el-col>
      <el-col :span="4" :offset="2" style="line-height: 120px">
        <div>
          <el-button type="primary" @click="registerNum">提交注册</el-button>
        </div>
        <div>
          <el-button type="primary" @click="registerNum">管理员申请</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    // 二次验证的方法
    // eslint-disable-next-line no-unused-vars
    const validateCheck = (rule, value, callback) => {
      if (value !== this.RegisterForm.password) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      RegisterForm: {
        username: '',
        password: '',
        doubleCheck: '',
        name: ''
      },
      RegisterFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, message: '用户名长度不小于2位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不小于6位', trigger: 'blur' }
        ],
        doubleCheck: [
          { required: true, trigger: 'blur', validator: validateCheck }
        ],
        name: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
          { min: 2, message: '姓名不小于2个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册函数
    registerNum() {
      this.$refs.RegisterFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/register', this.RegisterForm)
            .then(() => {
              this.$emit('closeRegisterDialog')
              this.$notify({
                title: '注册成功',
                message: '可使用注册的用户名与密码登录',
                type: 'success',
                duration: 2000
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

  }
}
</script>

<style lang="scss" >
  .Register_form {
    border-radius: 20px;
    .el-input {
      padding-left: 20px;
    }

    .el-form-item{
        border:solid lightgray 0.2px  !important;
        background: white !important;
    }

    input{
        color:black !important;
        caret-color:black !important;
    }
  }

</style>
