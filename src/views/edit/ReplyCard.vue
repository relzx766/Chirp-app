<template>
  <el-row>
    <el-row>
      <el-row v-if="isDiaLog" :style="{marginBottom:isDiaLog?'30px':'0px'}">
        <chirper-card :barVisible="false" :chirper="chirper" :dataVisible="false"
                      :mediaVisible="chirper.text&&chirper.text.trim.length>0?false:true" style="border: none;"
        />
        <el-row>
          <el-col :span="2">
            &nbsp;
          </el-col>
          <el-col :span="20" style="text-align: left;font-size: 14px">
            <span style="color:#409EFF;margin-left: 10px;">回复@{{ chirper.username }}</span>
          </el-col>
        </el-row>
      </el-row>
      <el-col :span="2" style="text-align: left;">
        <el-avatar :src="$store.getters.getUser.smallAvatarUrl" size="medium"></el-avatar>
      </el-col>
      <el-col :span="20" style="text-align: left">
        <el-row v-if="!isDiaLog">
          <span style="color:#409EFF;font-size: 14px;margin-left: 2%">回复@{{ chirper.username }}</span>
        </el-row>
        <div class="input-area">
          <el-input
              id="input-reply"
              v-model="text"
              autosize
              placeholder="发布你的回复!"
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
import {postReply} from "@/api/chirper";

export default {
  name: "ReplyCard",
  props: {
    chirper: {},
    isDiaLog: false
  },
  components: {
    'edit-bar': EditBar,
    'chirper-card': () => import('../chirper/ChirperCard.vue')
  },
  data() {
    return {
      text: '',
      media: []
    }
  },
  methods: {
    doPost() {
      postReply(this.text, this.chirper.id, this.media).then((res) => {
        if (res.code === 200) {
          this.text = '';
          this.media = [];
          this.$message({
            message: '发布回复成功',
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
      let input = document.getElementById("input-reply")
      let startPos = input.selectionStart;
      let endPos = input.selectionEnd;
      let resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
      input.value = resultText
      input.focus()
      input.selectionStart = startPos + emoji.data.length
      input.selectionEnd = startPos + emoji.data.length
      this.text = resultText
    }
  },
  created() {
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

.card-linker {
  border-left: 2px solid #C0C4CC;
  position: absolute;
  left: 5%;
  top: -36px;
  transform: translate(-50%, -50%);
  height: auto;
  min-height: 70px;
  z-index: 1;
}
</style>
