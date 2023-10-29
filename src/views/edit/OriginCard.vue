<template>
  <el-row>
    <el-row>
      <el-col :span="2" style="text-align: left">
        <el-avatar :src="$store.getters.getUser.smallAvatarUrl" size="medium"></el-avatar>
      </el-col>
      <el-col :span="20" style="text-align: left">
        <div class="input-area">
          <el-input
              id="input-origin"
              v-model="text"
              autosize
              placeholder="有什么新鲜事?!"
              style="font-weight: bold;font-size: 18px;  text-align: left;margin-left: -6px"
              type="textarea"
              @keyup.enter.native="()=>{text=text+'\u200B'}">
          </el-input>
        </div>
        <el-row style="margin-top: 20px;">
          <edit-bar :post-btn-disabled="this.text.trim().length <= 0&&media.length<=0" @addMedia="addMedia"
                    @emoji="setEmoji"
                    @post="doPost"
                    @removeMedia="removeMedia"/>
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
    }
  },
  methods: {
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
    addMedia({id}) {
      this.media.push(id);
      this.postBtnDisabled = false;
    },
    removeMedia(index) {
      this.media.splice(index, 1);
      this.postBtnDisabled = this.media.length <= 0 && this.text.trim().length <= 0;
    },
    setEmoji(emoji) {
      let input = document.getElementById("input-origin")
      let startPos = input.selectionStart;
      let endPos = input.selectionEnd;
      let result = this.text.substring(0, startPos) + emoji.data + this.text.substring(endPos)
      this.$set(this, 'text', result);
      input.focus();
      input.selectionStart = startPos + emoji.data.length;
      input.selectionEnd = startPos + emoji.data.length;
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
