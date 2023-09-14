<template>
  <div>
    <div style="text-align: left;padding: 6px">
      <el-row v-for="item in Object.keys(msg)">
        <el-col :span="2">
          <i v-if="type==='LIKE'" class="el-icon-star-on" style="color:#F56C6C;font-size: 30px"/>
          <i v-if="type==='FORWARD'" class="el-icon-connection" style="color:#67C23A;font-size: 30px"/>
          <i v-if="type==='REPLY'" class="el-icon-chat-dot-square" style="color: #909399;font-size: 30px;"/>
          <i v-if="type==='QUOTE'" class="el-icon-edit" style="color: #fdd835;font-size: 30px;"/>
        </el-col>
        <el-col :span="22">
          <el-row>
           <el-avatar v-for="i in msg[item]" :src="i.senderAvatar"/>
          </el-row>
          <el-row>
            {{getText(msg[item])}}
          </el-row>
          <el-row style="color: #909399;font-size: 12px">
            {{msg[item][0].text}}
          </el-row>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import {getMessageDate, getNewMsgCount} from "../../util/tools";


export default {
  name: "NoticeCard",
  props:{
    notice:{
      type:Array,
      default(){
        return []
      }
    },
    type:''
  },
  data(){
    return{
      msg:{}
    }
  },
  methods: {
     getNewMsgCount, getMessageDate,
    getText(msg){
      console.log(msg)
    let length=msg.length;
    let name=msg[length-1].senderName;
      let action;
      switch (this.type) {
        case 'LIKE':action="点赞了";break;
        case 'FORWARD':action="转发了";break;
        case 'QUOTE':action="引用了";break;
        case 'REPLY':action="回复了";break;
      }
      return length>1?`${name} 等${length}人 ${action}你的推文`:`${name} ${action}你的推文`;
    },
    classify(messages){
      return  messages.reduce((arr, item)=>{
        if (arr[item.targetId]){
          arr[item.targetId].push(item);
        }else {
          arr[item.targetId]=[item];
        }
        return arr;
      },{});
    }
  },
  watch:{
    'notice':{
      handler(n,o){
        console.log(n)
        this.msg=this.classify(n);
      },
      immediate:true
    }
  }
}
</script>

<style scoped>

</style>