<template>
<el-container>
  <el-main>
    <el-row>
      <el-col :span="14"  style="border-left:2px solid #EBEEF5;min-height: 100vh;border-right:2px solid #EBEEF5;">
        <el-container>
          <el-main>
            <el-row style="text-align: left;margin-bottom: 16px">
             <span style="font-weight: bold;font-size: 20px">
            通知
          </span>
            </el-row>
            <el-row v-for="item in Object.keys(notice)" style="border-bottom:1px solid #EBEEF5;">
              <notice-card  :notice="notice[item]" :type="item"/>
            </el-row>
          </el-main>
        </el-container>

      </el-col>
      <el-col :span="10">
<el-container>
  <el-main>
    <input-card/>
    <trend-card style="margin-top: 8%;background-color:#EBEEF5;border-radius: 10px"/>
  </el-main>
</el-container>
      </el-col>
    </el-row>
  </el-main>
</el-container>
</template>

<script>
import NoticeCard from "@/views/notice/NoticeCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";
import InputCard from "@/views/search/InputCard.vue";


export default {
  name: "Notice",
  components:{
    'notice-card':NoticeCard,
    'trend-card':TrendListCard,
    'input-card':InputCard
  },
  data(){
    return{
      notice:{
      },

      //后面接收的通知
      appendNotice:{},
      isInit:false
    }
  },
  methods:{
    classifyNotice(notice){
      return notice.reduce((arr, item) => {
        if (arr[item.type]) {
          arr[item.type].push(item);
        } else {
          arr[item.type] = [item];
        }
        return arr;
      }, {});
    },
  },
  watch:{
   '$store.state.msgCount':{
     handler(){
       if (!Object.keys(this.notice).length>0){
        this.notice=structuredClone(this.$store.getters.getNotice);
       }
     },
     immediate:true
   }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>