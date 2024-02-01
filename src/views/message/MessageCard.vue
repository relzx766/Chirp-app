<template>
  <div>
    <div style="text-align: left;padding: 6px">
      <div class="container text-center">
        <div class="justify-content-start d-flex w-100" :class="reverse?['flex-row-reverse']:['flex-row']">
            <el-avatar
                :src="user.smallAvatarUrl" fit="cover" style="cursor: pointer"
                       @click.native="$router.push('/profile?id='+user.id)"/>
            <div style="overflow-wrap: break-word;"
                 class="d-flex align-items-center ms-2 me-2 text-start  w-75 justify-content-start"
                 :class="reverse?['flex-row-reverse']:[]">
               <span v-if="message.type===chatTypeEnums.TEXT"
                     style="max-width: 80%"
                     class="shadow-sm p-2 text-wrap  rounded-bottom"
                     :class="reverse?['bg-primary','text-white',' rounded-start']
                     :['bg-body-tertiary','rounded-end',]"
                     v-html="formatText(message.content)"></span>
              <div v-else-if="message.type===chatTypeEnums.IMAGE">
                <el-image
                    :preview-src-list="mediaList"
                    :src="message.content"
                    fit="container"
                    style="border-radius: 12px;max-width: 300px;"
                />

              </div>
              <div v-else-if="message.type===chatTypeEnums.VIDEO" style="width: 300px;height: 300px">
                <file-card :url="message.content"/>
              </div>
              <file-card v-else :url="message.content"/>
              <div  v-if="message.isSending" class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div v-else-if="message.status===messageStatusEnums.FAILED">
                <i class="bi bi-exclamation-circle-fill text-danger"/>
              </div>
              <div v-else class="ms-2 me-2 align-self-center">
                <el-popover
                    trigger="click"
                    width="auto"
                    :visible-arrow="false"
                >
                  <el-row>
                    <el-button  class="border border-0 fw-bold text-black"
                                @click="doReply">
                      <i class="bi bi-reply"/>
                      回复
                    </el-button>
                  </el-row>
                  <el-row>
                    <el-button  class="border border-0 fw-bold text-black"
                                @click="copy(message.content)">
                      <i class="bi bi-copy"/> 复制
                    </el-button>
                  </el-row>
                  <el-row>
                    <el-button  class="border border-0 fw-bold text-black"
                                @click="doDelete">
                      <i class="bi bi-trash3"/>
                      删除
                    </el-button>
                  </el-row>
                  <el-button slot="reference" icon="el-icon-more" circle style="border: none"></el-button>
                </el-popover>
              </div>
            </div>



          </div>
        <div v-if="message.reference&&message.reference.id"
                           class="d-flex align-items-center"
                           :class="reverse?['justify-content-end','me-5']:['justify-content-start','ms-5']">
        <div v-if="message.reference.status===messageStatusEnums.DELETE
             ||message.reference.status===currentUser.id
             ||message.reference.conversationId!==message.conversationId
"
             class="  bg-dark-subtle m-1 shadow-sm p-2 rounded text-secondary"
             style="font-size: 12px;overflow-wrap: break-word">
          消息已删除或不可用
        </div>
        <div v-else style="max-width: 80%;text-align: left;">
          <div class="text_chat_msg  bg-dark-subtle m-1 shadow-sm p-2 rounded"
               style="font-size: 12px">
            <span>{{ message.reference.senderName }}:</span>
            <v-clamp  autoresize :max-lines="2" v-if="message.reference.type===chatTypeEnums.TEXT"
                      style="cursor: pointer" @click.native="showRefer(message.reference.content)">{{message.reference.content}} </v-clamp>
            <el-image v-else-if=" message.reference.type===chatTypeEnums.IMAGE"
                      :preview-src-list="[message.reference.content]"
                      :src=" message.reference.content"
                      fit="container"
                      style="max-height: 60px;border-radius: 8px"
            />
            <div v-else-if="message.reference.type===chatTypeEnums.VIDEO" style="width: 300px;height: 300px">
              <file-card :url="message.reference.content"/>
            </div>
            <file-card v-else :url="message.reference.content"/>
          </div>
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
import {copy} from "@/util/clipboard";
import VideoPlayer from "@/views/media/VideoPlayer.vue";
import {chatTypeEnums, messageStatusEnums} from "@/enums/enums";
import FileCard from "@/views/media/FileCard.vue";
import {mapState} from "vuex";
import {chatMutations} from "@/config/vuex/mutation-types";
import {chatActions} from "@/config/vuex/action-types";
export default {
  name: "MessageCard",
  computed: {
    chatTypeEnums() {
      return chatTypeEnums
    },
    messageStatusEnums() {
      return messageStatusEnums
    },
    ...mapState({
      currentUser:state => state.user
    })
  },
  components:{
    FileCard,
    VideoPlayer,
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
    showAvatar:true,
    showNickname:false,
    showPopover:true
  },
  methods: {
    copy,
    formatText, msgDate, getNewMsgCount, getMessageDate, getDate,
    doReply() {
      this.$store.commit(`chat/${chatMutations.SET_CHAT_REPLY}`, {message:this.message});
    },
    doDelete() {
      this.$store.dispatch(`chat/${chatActions.DELETE_CHAT_RECORD}`,{conversation:this.message.conversationId,id:this.message.id});
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
created() {
}

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
