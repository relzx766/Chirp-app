<template>
  <div>
    <div v-if="!reverse" style="text-align: left;padding: 6px">
      <div class="container text-center">
        <div class="row row-cols-2">
          <div class="col-1" style="text-align: left">
            <el-avatar :src="user.smallAvatarUrl" fit="cover" style="cursor: pointer"
                       @click.native="$router.push('/profile?id='+user.id)"/>
          </div>
          <div class="col-11">
            <div class="d-flex align-items-center justify-content-start">
              <div style="max-width: 80%;text-align: left;">
               <span v-if="message.type==='TEXT'" class="text_chat_msg bg-body-tertiary shadow-sm p-2 rounded-end rounded-bottom"
                     v-html="formatText( message.content)"></span>
                <el-image v-else-if="message.type==='IMAGE'"
                          :preview-src-list="mediaList"
                          :src="message.content"
                          fit="container"
                          style="max-width: 60%;max-height: 500px;border-radius: 12px"
                />
                <span v-else class="text_chat_msg shadow-sm p-3 rounded-end rounded-bottom">&nbsp;</span>
              </div>
              <div class="ms-md-2">
                <el-popover
                    trigger="click"
                    width="auto"
                    :visible-arrow="false"
                >
                  <el-row>
                    <el-button icon="el-icon-paperclip" class="border border-0 fw-bold text-black"
                               @click="doReply">回复
                    </el-button>
                  </el-row>
                  <el-row>
                    <el-button icon="el-icon-document-copy" class="border border-0 fw-bold text-black"
                               @click="doCopy">复制
                    </el-button>
                  </el-row>
                  <el-row>
                    <el-button icon="el-icon-delete" class="border border-0 fw-bold text-black"
                               @click="doDelete">删除
                    </el-button>
                  </el-row>
                  <el-button slot="reference" icon="el-icon-more" circle style="border: none"></el-button>
                </el-popover>
              </div>
            </div>
            <div v-if="message.reference&&message.reference.id" class="d-flex align-items-center justify-content-start">
              <div style="max-width: 80%;text-align: left;">
              <span class="text_chat_msg  bg-dark-subtle m-1 shadow-sm p-2 rounded"
                    style="font-size: 12px">
                 <span>{{ message.reference.senderName }}:</span>
                 <v-clamp  autoresize :max-lines="2" v-if="message.reference.type==='TEXT'"
                          style="cursor: pointer" @click.native="showRefer(message.reference.content)">{{message.reference.content}} </v-clamp>
                <el-image v-else-if=" message.reference.type==='IMAGE'"
                          :preview-src-list="[message.reference.content]"
                          :src=" message.reference.content"
                          fit="container"
                          style="max-height: 60px;border-radius: 8px"
                />
                <span v-else class="text_chat_msg shadow-sm p-3 rounded-end rounded-bottom">&nbsp;</span>
                 </span>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="reverse" style="padding: 6px;text-align: right">
      <div class="container text-center">
        <div class="row row-cols-2 ">
          <div class="col-11">
            <div class="d-flex align-items-center justify-content-end ">
              <div class="me-md-2">
                <div v-if="message.isSending" class="loading"/>
                <el-popover v-else
                            trigger="click"
                            width="auto"
                            :visible-arrow="false"
                >
                  <el-row>
                    <el-button icon="el-icon-paperclip" class="border border-0 fw-bold text-black"
                               @click="doReply">回复
                    </el-button>
                  </el-row>
                  <el-row>
                    <el-button icon="el-icon-document-copy" class="border border-0 fw-bold text-black"
                               @click="doCopy">复制
                    </el-button>
                  </el-row>
                  <el-row>
                    <el-button icon="el-icon-delete" class="border border-0 fw-bold text-black"
                               @click="doDelete">删除
                    </el-button>
                  </el-row>
                  <el-button slot="reference" icon="el-icon-more" circle style="border: none"></el-button>
                </el-popover>

              </div>
              <div style="max-width: 80%;text-align: right;">
                      <span v-if="message.type==='TEXT'" class="text_chat_msg shadow-sm p-2 rounded-start rounded-bottom"
                            style="background-color: #409EFF;color: white;text-align: left"
                            v-html="formatText( message.content)"></span>
                <el-image v-else-if="message.type==='IMAGE'"
                          :preview-src-list="mediaList"
                          :src="message.content"
                          fit="container"
                          style="max-width: 60%;max-height: 500px;border-radius: 12px"
                />
                <span v-else class="text_chat_msg shadow-sm p-3 rounded-end rounded-bottom">&nbsp;</span>
              </div>
            </div>
            <div v-if="message.reference&&message.reference.id" class="d-flex align-items-center justify-content-end">
              <div style="max-width: 80%;text-align: left;">
              <span class="text_chat_msg  bg-dark-subtle m-1 shadow-sm p-2 rounded"
                    style="font-size: 12px">
                 <span>{{ message.reference.senderName }}:</span>
               <v-clamp autoresize :max-lines="2" v-if="message.reference.type==='TEXT'"
                        style="cursor: pointer"   @click.native="showRefer(message.reference.content)" >
                 {{message.reference.content}} </v-clamp>
                <el-image v-else-if=" message.reference.type==='IMAGE'"
                          :preview-src-list="[message.reference.content]"
                          :src=" message.reference.content"
                          fit="container"
                          style="max-height: 60px;border-radius: 8px"
                />
                <span v-else class="text_chat_msg shadow-sm p-3 rounded-end rounded-bottom">&nbsp;</span>
                 </span>
              </div>


            </div>
          </div>
          <div class="col-1" style="text-align: right">
            <el-avatar :src="user.smallAvatarUrl" fit="cover" style="cursor: pointer"
                       @click.native="$router.push('/profile?id='+user.id)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatText, getDate, getMessageDate, getNewMsgCount} from "@/util/tools";
import {msgDate} from "@/util/formatter";
import VClamp from "vue-clamp";
import {markAsDel} from "@/api/advice";
export default {
  name: "MessageCard",
  components:{
    VClamp
  },
  props: {
    message: {},
    user: {},
    reverse: {
      type: Boolean,
      default: false
    },
    mediaList: Array,
  },
  methods: {
    formatText, msgDate, getNewMsgCount, getMessageDate, getDate,
    doReply() {
      this.$store.commit('setChatToReply', this.message);
    },
    doCopy() {
      navigator.clipboard.writeText(this.message.content);
      this.$message({
        message: '已复制到剪切板',
        iconClass: "el-icon-document-copy",
        customClass: "bottom-msg",
        offset: 630,
        duration:1000
      })
    },
    doDelete() {
      this.$store.commit('delMsg',{
        conversation:this.message.conversationId,
        messageId:this.message.id
      });
      markAsDel(this.message.id);
    },
    showRefer(content){
      this.$confirm(content,'',{
        showCancelButton:false,
        showConfirmButton:false,
        showClose:false
      }).catch(e=>{
        console.log(e)
      })
    }
  },


}
</script>

<style scoped>
.text_chat_msg {
  display: inline-grid;
}

.loading {
  margin-right: 2px;
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 2px solid #409EFF;
  border-top-color: transparent;
  border-radius: 100%;
  animation: circle infinite 0.75s linear;
}

.loading-box {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: #FFFFFF;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<style>
.bottom-msg {
  background-color: #409EFF !important;
  color: white;
  min-width: 10px !important;
  padding: 12px;
  font-size: 14px;
}
</style>
