<template>
  <el-row>
    <el-row>
      <el-col :span="2" style="text-align: left">
        <el-avatar :src="$store.getters.getUser.smallAvatarUrl" size="medium"></el-avatar>
      </el-col>
      <el-col :span="20" style="text-align: left">
        <div class="input-area">
          <el-input
              v-model="text"
              autosize
              placeholder="有什么新鲜事?!"
              style="font-weight: bold;font-size: 18px;  text-align: left;margin-left: -6px"
              type="textarea" @input="inputLimit()">
          </el-input>
        </div>
        <el-row style="margin-top: 20px;">
          <edit-bar :post-btn-disabled="postBtnDisabled" @post="doPost"
          @removeMedia="removeMedia"
          @addMedia="addMedia"/>
        </el-row>
      </el-col>
    </el-row>

  </el-row>
</template>

<script>
import EditBar from "@/views/edit/EditBar.vue";
import {postChirper} from "@/api/chirper";

export default {
  name: "OriginCard",
  components: {
    'edit-bar': EditBar
  },
  data() {
    return {
      text: '',
      media: [],
      postBtnDisabled: true
    }
  },
  methods: {
    inputLimit() {
      this.postBtnDisabled = this.text.trim().length <= 0;
    },
    doPost() {
      postChirper(this.text, JSON.stringify(this.media)).then((res) => {
        if (res.code === 200) {
          this.text = '';
          this.media = [];
          this.$message({
            message: '发布推文成功',
            type: 'success'
          });
        }
      })
    },
    addMedia({id}){
      this.media.push(id);
      this.postBtnDisabled=false;
    },
    removeMedia(index){
      this.media.splice(index,1);
      this.postBtnDisabled=this.media.length<=0&&this.text.trim().length<=0;
    }

  }
}
</script>

<style scoped>
.input-area {
  text-align: left;
}

/* 利用穿透，设置input边框隐藏 */
.input-area >>> .el-input__inner {
  border: 0;
}

/* 如果你的 el-input type 设置成textarea ，就要用这个了 */
.input-area >>> .el-textarea__inner {
  border: 0;
  resize: none; /* 这个是去掉 textarea 下面拉伸的那个标志，如下图 */
}
</style>