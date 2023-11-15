<template>
  <el-container>
    <el-main>
      <div class="row">
        <div class="col-7 "
             style="border-left:2px solid #EBEEF5;height: 100vh;
             border-right:2px solid #EBEEF5;">
          <chirper-card
              class="overflow-y-auto"
              style="max-height: 96vh;"
              :is-login="getToken()!=null&&getToken().length>0">
          </chirper-card>
        </div>
       <div class="col-5">
         <el-container>
           <el-main>
             <el-row>
               <el-col v-if="getToken()!=null&&getToken().length>0" :span="20">
                 <input-card/>
                 <trend-card style="margin-top: 8%;background-color:#EBEEF5;border-radius: 10px"/>
               </el-col>
               <el-col v-if="getToken()==null||!getToken().length>0" :span="20">

                 <login-card/>

               </el-col>

             </el-row>

           </el-main>
         </el-container>
       </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import TrendListCard from "@/views/explore/TrendListCard.vue";
import ChirperListCard from "@/views/home/ChirperListCard.vue";
import InputCard from "@/views/search/InputCard.vue";
import LoginCard from "@/views/sign/LoginCard.vue";
import {getToken} from "@/util/auth";

export default {
  name: "Home",
  methods: {getToken},
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  components: {
    'chirper-card': ChirperListCard,
    'trend-card': TrendListCard,
    'input-card': InputCard,
    'login-card': LoginCard
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
  float: left;
}
.overflow-y-auto ::-webkit-scrollbar{
  display: none;
}
</style>
