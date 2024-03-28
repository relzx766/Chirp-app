<template>
  <el-row>
    <el-row>
      <el-col :span="2" style="text-align: left">
        <el-avatar :src="user.smallAvatarUrl" size="medium"></el-avatar>
      </el-col>
      <el-col :span="20" style="text-align: left">
        <div class="input-area">
          <!--          <textarea
                        id="input-origin"
                        class="el-textarea__inner d-flex fw-bold fs-6"
                        v-model="text"
                        placeholder="有什么新鲜事?!"
                        @input="fetchUser=true"
                        @keyup.enter="()=>{text=text+'\u200B'}"
                    ></textarea>-->
          <!--
          用这个会非常的卡，cpu会被占满，不停的重新绘制dom-->
          <el-input

              v-model="text"
              autosize
              placeholder="有什么新鲜事?!"
              style="font-weight: bold;font-size: 18px;  text-align: left;margin-left: -6px"
              type="textarea"
              @input="fetchUser=true"
              @keyup.enter.native="()=>{text=text+'\u200B'}">
          </el-input>
        </div>
        <el-row>
          <edit-bar :active-date-time="activeTime"
                    :fetch="fetchUser"
                    :post-btn-disabled="this.text.trim().length <= 0&&media.length<=0"
                    :show-range="true"
                    :text="text"
                    @addMedia="addMedia"
                    @doMention="doMention"
                    @doScheduleClear="doScheduleClear"
                    @doScheduleConfirm="doScheduleConfirm"
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
import {mapState} from "vuex";

export default {
  name: "OriginCard",
  components: {
    'edit-bar': EditBar
  },
  props: {
    communityId: String
  },
  data() {
    return {
      text: '',
      media: [],
      activeTime: "",
      fetchUser: true
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    doPost(replyRange) {
      let activeTime = this.activeTime ? new Date(this.activeTime).getTime() : null;
      postChirper(this.text, this.media, replyRange.code, activeTime, this.communityId).then((res) => {
        if (res.code === 200) {
          this.text = '';
          this.media = [];
          this.activeTime = "";
          this.$message({
            message: '发布推文成功',
            type: 'success'
          });
          this.$emit("sent", res.data.record);
        }
      })
    },
    addMedia(media) {
      this.media.push(media);
    },
    removeMedia(index) {
      this.media.splice(index, 1);
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
    },
    doMention(username) {
      this.fetchUser = false;
      if (username.trim().length > 0) {
        const lastIndex = this.text.lastIndexOf('@');
        if (lastIndex !== -1) {
          this.text = this.text.substring(0, lastIndex) + '@' + username;
        }
      }
    },
    doScheduleConfirm(dateTime) {
      this.activeTime = dateTime;
    },
    doScheduleClear() {
      this.activeTime = "";
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
