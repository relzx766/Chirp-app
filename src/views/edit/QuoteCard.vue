<template>
  <el-row>
    <el-col :span="2" style="text-align: left">
      <el-avatar :src="$store.getters.getUser.smallAvatarUrl" size="medium"></el-avatar>
    </el-col>
    <el-col :span="22" style="text-align: left">
      <div class="input-area">
        <el-input
            id="input-quote"
            v-model="text"
            autosize
            placeholder="发表你的看法!"
            style="font-weight: bold;font-size: 18px;  text-align: left;margin-left: -6px"
            type="textarea"
            @keyup.enter.native="()=>{text=text+'\u200B'}">
        </el-input>
      </div>
      <el-row style="margin-top: 20px;">
        <edit-bar :post-btn-disabled="this.text.trim().length <= 0&&media.length<=0" @addMedia="addMedia"
                  @emoji="setEmoji"
                  @post="doPost()"
                  @removeMedia="removeMedia"/>
      </el-row>
      <el-row style="margin-top: 20px;border: 1px solid #EBEEF5;border-radius: 12px;padding: 8px;zoom: 0.92;">
        <chirper-card :barVisible="false" :chirper="chirper" :dataVisible="false" shadow="hover"></chirper-card>
      </el-row>

    </el-col>
  </el-row>
</template>

<script>
import {quoteChirper} from "@/api/chirper";
import EditBar from "@/views/edit/EditBar.vue";

export default {
  name: "QuoteCard",
  props: {
    chirper: {}
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
      quoteChirper(this.text, this.chirper.id, this.media).then((res) => {
        if (res.code === 200) {
          this.text = '';
          this.media = [];
          this.$emit("sent");
          this.$message({
            message: '发布推文成功',
            type: 'success'
          });
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
      let input = document.getElementById("input-quote")
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
