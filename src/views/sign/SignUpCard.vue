<template>
  <el-row style="width: 100%;">
    <el-container>
      <el-header>
        <el-row>
          <el-button v-if="active>0" round size="small" style="float: left" type="info"
                     @click="active>0?active--:active">back
          </el-button>
          <img src="../../assets/logo.svg" width="40px">
          <el-button v-if="active<1" round size="small" style="float: right" type="primary" @click="doNext()">next
          </el-button>
        </el-row>
      </el-header>
      <el-main>
        <el-row v-if="active===0">
          <el-row>
            <el-input v-model="username" class="sign-form-input" placeholder="用户名" size="medium"/>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-input v-model="password" class="sign-form-input" placeholder="密码" size="medium"/>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-input v-model="email" class="sign-form-input" placeholder="邮箱" size="medium"/>
          </el-row>
          <el-row style="margin-top: 40px;margin-bottom: 14px;font-weight: bold;text-align: left">
            <span>你的生日</span>
          </el-row>
          <el-row>
            <el-date-picker
                v-model="birthday"
                :picker-options="pickerOptions"
                format="yyyy 年 MM 月 dd 日"
                placeholder="生日"
                style="width: 100%;float: right"
                type="date">
            </el-date-picker>
          </el-row>


        </el-row>

        <el-row v-if="active===1">
          <img src="../../assets/star-eye.svg" width="70%">
          <el-row>你已完成全部工作，现在开始使用吧!</el-row>
          <el-row>
            <el-button round style="width: 60%" type="primary" @click="()=>{$router.go(0)}">开始</el-button>
          </el-row>
        </el-row>
      </el-main>
    </el-container>

  </el-row>

</template>

<script>
import moment from "moment";
import {signUp} from "@/api/sign";

export default {
  name: "SignUpCard",
  data() {
    return {
      username: "",
      password: "",
      email: "",
      birthday: "",
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        },
        selectableRange: '00:00:00 - ' + new Date().getHours() + ':' + (new Date().getMinutes() + 1) + ':00'
      },
      active: 0,
      nextDisabled: true
    }
  },
  methods: {
    doNext() {
      if (this.active === 0) {
        let birthday = moment(this.birthday).format("YYYY-MM-DD");
        signUp(this.username, this.password, this.email, birthday).then((res) => {
          if (res.code === 200) {
            this.active++;
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }
    },
    getYearOptions() {
      let date = new Date();
      let options = [];
      for (let i = date.getFullYear(); i > date.getFullYear() - 100; i--) {
        options.push(i);
      }
      return options;
    },
    getMonthOptions() {
      let option = [];
      for (let i = 1; i < 13; i++) {
        option.push(i);
      }
      return option;
    },
    getDayOptions() {
      let firstDay = new Date(this.birthday.year, this.birthday.month, 1);
      let nextMonthFirstDay = new Date(this.birthday.year, this.birthday.month + 1, 1);
      let lastDay = new Date(nextMonthFirstDay - 1);
      let start = parseInt(moment(firstDay).format("D"));
      let end = parseInt(moment(lastDay).format("D"));
      let option = [];
      for (let i = start; i < end + 1; i++) {
        option.push(i);
      }
      return option;
    }
  },
  created() {
    this.getDayOptions()
  }
}
</script>

<style scoped>

.sign-form-input {
  width: 100%;
}
</style>