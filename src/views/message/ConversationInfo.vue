<template>
<div>
  <div class="user-card" @click="$router.push('/profile?username='+userInfo.username)">
    <div class="row d-flex align-items-center border border-top-0  p-3 ">
      <div class="col-2">
        <el-avatar :src="userInfo.smallAvatarUrl" fit="cover"/>
      </div>
      <div class="col text-start " style="font-size: 14px;margin-left: -10px;">
        <div class="row">
          <span class=" fw-bold" style="color: #303133">{{userInfo.nickname}}</span>
        </div>
        <div class="row">
          <span style="color:#909399;">@{{userInfo.username}}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="btn_leave row " @click="leaveDialog=true">
    <div class="p-3 d-flex align-items-center justify-content-center">
      <span style="color:#F56C6C">离开对话</span>
    </div>

  </div>
  <el-dialog
      :visible.sync="leaveDialog"
      width="20%"
      :show-close="false"
      :append-to-body="true">
    <div class="text-start p-2">
      <el-row class="fs-5 fw-bold" style="color: #303133">离开对话？</el-row>
       <el-row class="fs-6 m-2 mb-4">此对话将从你的收件箱中删除。对话中的其他用户仍然可以看到它。 </el-row>
      <el-row class="m-2"><el-button class="fw-bold" style="width: 100%" round type="danger" @click="doLeave">离开</el-button></el-row>
      <el-row class="m-2"><el-button class="fw-bold" style="width: 100%" round @click="leaveDialog=false">取消</el-button></el-row>

    </div>
  </el-dialog>
</div>
</template>
<script>
import {getDetailProfile} from "@/api/user";
import {leaveConv} from "@/api/advice";
import {mapState} from "vuex";
import {chatActions} from "@/config/vuex/action-types";

export default {
  name: "ConversationInfo",
  props:{
    userId:"",
    conversation:""
  },
  computed:{
    ...mapState({
      user:state=>state.user
    }),
    userInfo(){
      return this.user.userList[this.userId];
    }
  },
  data(){
    return{
      leaveDialog:false
    }
  },
  methods:{
    doLeave() {
      this.$store.dispatch(`chat/${chatActions.LEAVE_CONVERSATION}`).then(()=>{
        this.$router.push('/message');
      }).catch(e=>{
        this.$message.error(e);
      })
    }
  },
  created(){
  }
}
</script>

<style scoped>
.user-card{
  cursor: pointer;
}
.user-card :hover{
  background-color: #f0f4f4;
}
.btn_leave :hover{
  background-color: #ffccc7;
}
.btn_leave{
  cursor: pointer;
}
::v-deep .el-dialog .el-dialog__body {
  padding-top: 0;
}
</style>
