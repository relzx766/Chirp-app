<template>
  <el-row>
    <waterfall :col="fileList.length>2?2:fileList.length"

               :data="fileList"
               :isTransition="false"
               style="margin-bottom: 12px;width:100%;overflow-x: hidden;">
      <div v-for="(file,index) in fileList" :key="file.name" style="margin-top: 10px;">
        <uploading-card
            :file="file.raw"
            @remove="removeFile(index)"
            @uploaded="media=>{addMediaKey(media);}"/>
      </div>

    </waterfall>
    <el-row v-if="showRange" class="border-bottom">
      <div class="btn-group">
        <button type="button"
                class="btn btn-outline-primary border-0 rounded-pill  text-primary fw-bold comment-range-box"
                data-bs-toggle="dropdown" aria-expanded="false">
          <span v-if="commentRange===commentRangeEnums.EVERYONE">
            <i :class="commentRangeEnums.EVERYONE.icon" class="me-2 "/>
            <span >任何人</span></span>
          <span v-else-if="commentRange===commentRangeEnums.FOLLOWING">
            <i :class="commentRangeEnums.FOLLOWING.icon" class="me-2"/>
            <span >你关注的</span></span>
          <span v-else-if="commentRange===commentRangeEnums.MENTION">
            <i :class="commentRangeEnums.MENTION.icon" class="me-2"/>
            <span >被提及的</span></span>
        </button>
        <ul class="dropdown-menu comment-range-box rounded-4" style="cursor: pointer;width: 220px;">
          <li>
            <div class="d-flex flex-column align-items-start w-100 flex-wrap p-2">
              <span class="text-dark fw-bold">谁可以回复?</span>
              <span class="text-secondary ">选择可以回复这个帖子的群体，被提及的永远可以回复。</span>
            </div>
          </li>
          <li class="m-2">
            <div class="dropdown-item fw-bold "
          @click="doCommentRangeChange(commentRangeEnums.EVERYONE)">
            <i :class="commentRangeEnums.EVERYONE.icon"
               class="me-2 range-icon text-white rounded-circle p-1"/>
            <span class="text-dark">任何人</span>
          </div></li>
          <li class="m-2"><div class="dropdown-item text-primary fw-bold"
                               @click="doCommentRangeChange(commentRangeEnums.FOLLOWING)">
            <i :class="commentRangeEnums.FOLLOWING.icon"
               class="me-2 range-icon  text-white rounded-circle p-1"/>
            <span class="text-dark">你关注的</span>
          </div></li>
          <li class="m-2"><div class="dropdown-item text-primary fw-bold"
                               @click="doCommentRangeChange(commentRangeEnums.MENTION)">
            <i :class="commentRangeEnums.MENTION.icon"
               class="me-2 range-icon  text-white rounded-circle p-1"/>
            <span class="text-dark">被提及的</span>
          </div></li>
        </ul>
      </div>
    </el-row>
    <div class="progress " style="height: 4px;" v-show="searching">
      <div class=" progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
    </div>
    <div class=" position-absolute end-0 w-50"

         style="z-index: 10;">
      <div class="row  w-100 list-group shadow"
           >
        <el-row
            v-for="(item,index) in users" :key="item.id"
            @click.native="selectUser(item.username)"
            class="d-flex justify-content-start align-items-center list-group-item list-group-item-action border-0  rounded-0"
        :class="index===users.length-1?['rounded-bottom']:['rounded-0']">
          <span>
            <el-avatar :src="item.smallAvatarUrl" fit="cover" size="large"/>
          </span>

              <el-row class="d-flex flex-column w-100 ms-2">
                        <span
                            class="d-inline-block text-truncate fw-bold text-dark fs-6 "
                            style="max-width: 96%">
                          {{ item.nickname }}
                        </span>
                <span class="d-inline-block text-truncate text-secondary " style="max-width: 96%;font-size: 14px">
                        @{{ item.username }}
                      </span>
                <span v-if="relationEnums.FOLLOW===item.relation"
                      style="font-size: 14px"
                      class="d-inline-block text-secondary">
                  <i class="bi bi-person-fill"/>关注中
                </span>
              </el-row>

            </el-row>
      </div>
    </div>
    <el-row class="pt-2">
      <el-col :span="14">
        <el-upload
            :auto-upload="false"
            :limit="9"
            :on-change="handlerFileChange"
            :show-file-list="false"
            action="#"
            multiple
            style="display: inline-block">
          <el-button circle  class="border-0 text-primary">
            <i class="bi bi-image "/>
          </el-button>
        </el-upload>
        <el-popover

            trigger="click"
            width="auto"
        >
          <VEmojiPicker @select="selectEmoji"/>
          <el-button slot="reference" circle  class="border-0 text-primary">
            <i class="bi bi-emoji-smile"/>
          </el-button>
        </el-popover>

      </el-col>
      <el-col :span="10" style="text-align: right">
        <el-button ref="btn-post" :disabled="postBtnDisabled||sending" icon="el-icon-s-promotion"
                   round size="small" type="primary" @click="doSend()">发布
        </el-button>
      </el-col>
    </el-row>

  </el-row>
</template>

<script>
import UploadingFile from "@/views/media/UploadingFile.vue";
import {VEmojiPicker} from "v-emoji-picker";
import {commentRangeEnums, relationEnums, supportMediaTypeEnums} from "@/enums/enums";
import {search} from "@/api/user";

export default {
  name: "EditBar",
  computed: {
    relationEnums() {
      return relationEnums
    },
    commentRangeEnums() {
      return commentRangeEnums
    }
  },
  props: {
    text:String,
    postBtnDisabled: true,
    showRange:Boolean,
    fetch:Boolean
  },
  components: {
    'uploading-card': UploadingFile,
    VEmojiPicker
  },
  data() {
    return {
      fileList: [],
      sending:false,
      commentRange:commentRangeEnums.EVERYONE,
      searching:false,
      users:[],
      keyword:""
    }
  },
  methods: {
    doCommentRangeChange(range){
      this.commentRange=range;
    },
    doSend() {
      this.sending=true;
      this.fileList = [];
      this.$emit('post',this.commentRange);
      this.sending=false;
    },
    handlerFileChange(file, fileList) {
      let type = file.raw.type.split("/").shift().toUpperCase();
      if (type !== supportMediaTypeEnums.IMAGE && type !== supportMediaTypeEnums.VIDEO) {
        this.$message.warning("不支持的文件类型");
      } else {

        if (this.fileList.length >= 9) {
          this.$message.warning("最多支持9张图片或者1个视频");
        } else if (this.fileList.length > 0 && this.fileList[0].raw.type.split("/").shift() === supportMediaTypeEnums.VIDEO) {
          this.$message.warning("最多支持9张图片或者1个视频");
        } else if (this.fileList.length > 0 && type === supportMediaTypeEnums.VIDEO) {
          this.$message.warning("最多支持9张图片或者1个视频");
        } else {
          this.fileList.push(file);
        }
      }
    },
    removeFile(index) {
      this.fileList.splice(index, 1);
      this.$emit("removeMedia", index);
    },
    addMediaKey(media) {
      this.$emit("addMedia", media);
    },
    selectEmoji(emoji) {
      this.$emit("emoji", emoji)
    },
    selectUser(username){
      this.$emit('doMention',username);
      this.users.splice(0,this.users.length);
    },
    searchUser(){
      this.users.splice(0,this.users.length);
        if (!this.keyword.includes('  ')&&this.keyword.trim().length > 0 && !this.searching) {
          this.searching = true;
          search(this.keyword, 1).then(res => {
            this.searching = false;
            if (res.code === 200 && res.data.record) {
              this.users.splice(0, this.users.length, ...res.data.record);
            }
          })
        }
    }
  },
  watch:{
    text(value){
      if (this.fetch&&!this.searching) {
        const match = value.match(/@([^@]*)$/);
        if (match) {
          this.keyword = match[1]; // 这里是最后一个@后面的字符
          this.searchUser();
        }
      }
    }
  }
}
</script>

<style scoped>
.bt-icon {
  width: 20px;

}
.comment-range-box{
  font-size: 14px;
}
.range-icon{
  background-color: #409EFF
}
</style>
