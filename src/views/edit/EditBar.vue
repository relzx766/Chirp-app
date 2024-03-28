<template>
  <el-row>
    <waterfall :col="fileList.length>2?2:fileList.length"
               :data="fileList"
               :isTransition="false"
               style="margin-bottom: 12px;width:100%;overflow-x: hidden;"
    >
      <div v-for="(file,index) in fileList" :key="file.uid" style="margin-top: 10px;">
        <uploading-card
            :file="file.raw"
            @remove="removeFile(index)"
            @uploaded="media=>{addMediaKey(media);}"/>
      </div>
    </waterfall>
    <el-row v-if="pickedSameFile" class="text-warning fs-8">你似乎选择了重复的文件。</el-row>
    <el-row v-if="showRange" class="border-bottom">
      <div class="btn-group">
        <button aria-expanded="false"
                class="btn btn-outline-primary border-0 rounded-pill  text-primary fw-bold comment-range-box"
                data-bs-toggle="dropdown" type="button">
          <span v-if="commentRange===commentRangeEnums.EVERYONE">
            <i :class="commentRangeEnums.EVERYONE.icon" class="me-2 "/>
            <span>任何人</span></span>
          <span v-else-if="commentRange===commentRangeEnums.FOLLOWING">
            <i :class="commentRangeEnums.FOLLOWING.icon" class="me-2"/>
            <span>你关注的</span></span>
          <span v-else-if="commentRange===commentRangeEnums.MENTION">
            <i :class="commentRangeEnums.MENTION.icon" class="me-2"/>
            <span>被提及的</span></span>
        </button>
        <ul class="dropdown-menu comment-range-box rounded-4 finger p-0" style="width: 220px;">
          <li>
            <div class="d-flex flex-column align-items-start w-100 flex-wrap p-2">
              <span class="text-dark fw-bold">谁可以回复?</span>
              <span class="text-secondary ">选择可以回复这个帖子的群体，被提及的永远可以回复。</span>
            </div>
          </li>
          <li class="mt-2 mb-2">
            <div class="dropdown-item fw-bold "
                 @click="doCommentRangeChange(commentRangeEnums.EVERYONE)">
              <i :class="commentRangeEnums.EVERYONE.icon"
                 class="me-2 range-icon text-white rounded-circle p-1"/>
              <span class="text-dark">任何人</span>
            </div>
          </li>
          <li class="mt-2 mb-2">
            <div class="dropdown-item text-primary fw-bold"
                 @click="doCommentRangeChange(commentRangeEnums.FOLLOWING)">
              <i :class="commentRangeEnums.FOLLOWING.icon"
                 class="me-2 range-icon  text-white rounded-circle p-1"/>
              <span class="text-dark">你关注的</span>
            </div>
          </li>
          <li class="mt-2 mb-2">
            <div class="dropdown-item text-primary fw-bold"
                 @click="doCommentRangeChange(commentRangeEnums.MENTION)">
              <i :class="commentRangeEnums.MENTION.icon"
                 class="me-2 range-icon  text-white rounded-circle p-1"/>
              <span class="text-dark">被提及的</span>
            </div>
          </li>
        </ul>
      </div>

    </el-row>
    <div v-show="searching" class="progress " style="height: 4px;">
      <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="100"
           class=" progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%"></div>
    </div>
    <div class=" position-absolute end-0 w-50"

         style="z-index: 10;">
      <div class="row  w-100 list-group shadow"
      >
        <el-row
            v-for="(item,index) in users" :key="item.id"
            :class="index===users.length-1?['rounded-bottom']:['rounded-0']"
            class="d-flex justify-content-start align-items-center list-group-item list-group-item-action border-0  rounded-0"
            @click.native="selectUser(item.username)">
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
                  class="d-inline-block text-secondary"
                  style="font-size: 14px">
                  <i class="bi bi-person-fill"/>关注中
                </span>
          </el-row>

        </el-row>
      </div>
    </div>
    <el-row class="pt-2">
      <el-col :span="14">
        <el-row>
          <el-upload
              :auto-upload="false"
              :limit="9"
              :on-change="handlerFileChange"
              :show-file-list="false"
              action="#"
              multiple
              style="display: inline-block">
            <el-button circle class="border-0 text-primary p-2">
              <i class="bi bi-image "/>
            </el-button>
          </el-upload>
          <el-popover
              :visible-arrow="false"
              trigger="click"
              width="auto"
          >
            <VEmojiPicker @select="selectEmoji"/>
            <el-button slot="reference" circle class="border-0 text-primary p-2">
              <i class="bi bi-emoji-smile"/>
            </el-button>
          </el-popover>
          <el-button :circle="!activeDateTime"
                     :round="!!activeDateTime"
                     class="border-0 text-primary p-2"
                     @click="scheduleDialog=true">
            <i class="bi bi-stopwatch"/>
            {{ activeDateTime }}
          </el-button>
          <el-dialog
              :show-close="false"
              :visible.sync="scheduleDialog"
              append-to-body
              custom-class="no-header-dialog"
              width="25%">
            <div class="p-2">
              <div class="row">
                <div class="col d-flex align-items-center">
                  <el-button circle
                             class="border-0  p-1 bg-white text-dark"
                             @click="scheduleDialog=false">
                    <i class="bi bi-x fs-4"/>
                  </el-button>
                  <span class="fs-5 fw-bold text-dark ms-4">定时</span>
                </div>
                <div class="col text-end">
                  <button
                      v-show="activeDateTime"
                      class="text-dark btn btn-link"
                      type="button"
                      @click="doScheduleClear">清除
                  </button>
                  <el-button class="border-0 btn btn-dark fs-6 ms-2" round
                             size="mini"
                             @click="doScheduleConfirm">
                    {{ activeDateTime ? '修改' : '确定' }}
                  </el-button>
                </div>
              </div>
              <div v-if="getEnableSchedule" class="w-100 p-2">
                <i class="bi bi-stopwatch"/>
                将在{{ activeDate }}的{{ activeTime }}发送
              </div>
              <form class="p-2">
                <div class="mb-3">
                  <label class="form-label" for="activeData">日期</label>
                  <el-date-picker
                      id="activeData"
                      v-model="activeDate"
                      class="form-control p-0 w-100 border-0"
                      format="yyyy-MM-dd"
                      type="date">
                  </el-date-picker>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="activeTime">时间</label>
                  <el-time-picker
                      id="activeTime"
                      v-model="activeTime"
                      class="form-control border-0 w-100 p-0"
                      ia-describedby="timeHelp"
                      value-format="HH:mm:ss">
                  </el-time-picker>
                  <div
                      v-show="!getEnableSchedule"
                      id="timeHelp"
                      class="form-text text-danger">
                    你不能定时在过去
                  </div>
                </div>
              </form>
            </div>
          </el-dialog>
        </el-row>

      </el-col>
      <el-col :span="10" style="text-align: right">
        <el-button ref="btn-post" :disabled="postBtnDisabled||sending"
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
import moment from "moment";

export default {
  name: "EditBar",
  computed: {
    relationEnums() {
      return relationEnums
    },
    commentRangeEnums() {
      return commentRangeEnums
    },
    getEnableSchedule() {
      this.activeDate = moment(this.activeDate).format("YYYY-MM-DD");
      let activeDateTime = moment(this.activeDate + ' ' + this.activeTime, 'YYYY-MM-DD HH:mm:ss').toDate();
      return activeDateTime.getTime() > Date.now();
    },
    pickedSameFile() {
      let m = {};
      for (let index in this.fileList) {
        let f = this.fileList[index]
        if (m[f.name]) {
          return true;
        }
        m[f.name] = 1;
      }
      return false;
    }
  },
  props: {
    text: String,
    postBtnDisabled: true,
    showRange: Boolean,
    fetch: Boolean,
    activeDateTime: String
  },
  components: {
    'uploading-card': UploadingFile,
    VEmojiPicker
  },
  data() {
    return {
      fileList: [],
      sending: false,
      commentRange: commentRangeEnums.EVERYONE,
      searching: false,
      users: [],
      keyword: "",
      scheduleDialog: false,
      scheduleConfirm: false,
      activeDate: moment().add(5, 'days').format('YYYY-MM-DD'),
      activeTime: moment().format('HH:mm:ss'),
    }
  },
  methods: {
    init() {
      if (this.activeDateTime === undefined || this.activeDateTime === null || this.activeDateTime === '') {
        this.activeDate = moment().add(5, 'days').format('YYYY-MM-DD');
        this.activeTime = moment().format('HH:mm:ss');
      } else {
        let activeDateTime = moment(this.activeDateTime, "YYYY-MM-DD HH:mm:ss");
        this.activeDate = activeDateTime.format('YYYY-MM-DD');
        this.activeTime = activeDateTime.format('HH:mm:ss');
      }
    },
    doCommentRangeChange(range) {
      this.commentRange = range;
    },
    doSend() {
      this.sending = true;
      this.fileList = [];
      this.$emit('post', this.commentRange);
      this.sending = false;
    },
    doScheduleConfirm() {
      this.activeDate = moment(this.activeDate).format("YYYY-MM-DD");
      let activeDateTime = moment(this.activeDate + ' ' + this.activeTime, 'YYYY-MM-DD HH:mm:ss');
      this.scheduleDialog = false;
      this.scheduleConfirm = true;
      this.$emit('doScheduleConfirm', activeDateTime.format("YYYY-MM-DD HH:mm:ss"));
    },
    doScheduleClear() {
      this.scheduleDialog = false;
      this.scheduleConfirm = false;
      this.$emit('doScheduleClear');
      this.init();
    },
    handlerFileChange(file, fileList) {
      let type = file.raw.type.split("/").shift().toUpperCase();
      if (type !== supportMediaTypeEnums.IMAGE && type !== supportMediaTypeEnums.VIDEO) {
        this.$message.warning("不支持的文件类型");
      } else {
        if (this.fileList.length >= 4) {
          this.$message.warning("最多支持4个媒体文件");
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
    selectUser(username) {
      this.$emit('doMention', username);
      this.users.splice(0, this.users.length);
    },
    searchUser() {
      this.users.splice(0, this.users.length);
      if (!this.keyword.includes('  ') && this.keyword.trim().length > 0 && !this.searching) {
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
  watch: {
    text(value) {
      if (this.fetch && !this.searching) {
        const match = value.match(/@([^@]*)$/);
        if (match) {
          this.keyword = match[1]; // 这里是最后一个@后面的字符
          this.searchUser();
        }
      }
    }
  },
  created() {
    this.init();
  }
}
</script>

<style scoped>
.bt-icon {
  width: 20px;

}

.comment-range-box {
  font-size: 14px;
}

.range-icon {
  background-color: #409EFF
}
</style>
