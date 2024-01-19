<template>
  <el-row>
    <ul>
      <li style="margin-left: -10%;" :class="getToken()===null||!chirper.replyable?['text-secondary']:['text-dark']">
        <el-button :disabled="getToken()===null||!chirper.replyable"
                   circle class="btn-interact"

                   size="medium" @click.stop="replyDialog=true">
          <i class="bi bi-chat fs-6 fw-bolder position-relative ">
            <i v-if="getToken()===null||!chirper.replyable"
               class="bi bi-x position-absolute start-50 top-50 translate-middle"/>
          </i>
        </el-button>
        <el-dialog
            :modal="false"
            :show-close="false"
            :visible.sync="replyDialog"
            width="50%" @click.native.self>
          <el-row class="p-2">
            <reply-card :chirper="chirper" :is-dia-log="true"
                        @sent="replyDialog=false;chirper.replyCount++;chirper.viewCount++"/>
          </el-row>
        </el-dialog>
        <span class="num">{{ getCount(chirper.replyCount) }}</span></li>
      <li>

        <el-popover
            popper-class="consumer-popper"
            trigger="click"
            width="auto"
            placement="top"
            :visible-arrow="false"

        >
          <el-row>
            <el-row>
              <el-button :style="{ color: chirper.isForward ? '#67C23A' : '#606266' }" class="btn-interact"
                         size="medium" style="font-size: 16px" @click="doForward()">
                <i class="bi bi-repeat text-dark fw-bolder me-2"/>
                <span
                  >转发</span></el-button>
            </el-row>
            <el-row>
              <el-button :style="{ color: chirper.isQuote ? '#409EFF' : '#606266' }" class="btn-interact"
                         size="medium" style="font-size: 16px"
                         @click="quoteDialog=true">
                <i class="bi bi-pencil-square text-dark fw-bolder me-2"/>
                <span
              >引用</span></el-button>
            </el-row>
            <el-dialog
                :modal="false"
                :show-close="false"
                :visible.sync="quoteDialog"
                width="50%">
              <el-row>
                <quote-card :chirper="chirper"
                            @sent="quoteDialog=false;chirper.isQuote=true;chirper.quoteCount++;chirper.viewCount++;"/>
              </el-row>
            </el-dialog>
          </el-row>
          <el-button slot="reference" :disabled="getToken()===null"
                     :style="{ color: chirper.isQuote||chirper.isForward ? '#67C23A' : '#606266' }" circle
                     class="btn-interact"
                     size="medium">
            <i class="bi bi-repeat fs-6 fw-bolder text-dark"/>
          </el-button>
        </el-popover>
        <span class="num">{{ getCount(chirper.forwardCount + chirper.quoteCount) }}</span>

      </li>
      <li :style="{ color: chirper.isLike ? '#F56C6C' : '#606266' }">
        <el-button :disabled="getToken()===null"
                   :style="{ color: chirper.isLike ? '#F56C6C' : '#606266' }" circle class="btn-interact"
                   size="medium"
                   @click.stop="doLike()">
          <i v-if="chirper.isLike" class="bi bi-heart-fill fs-6 fw-bolder "/>
          <i v-else class="bi bi-heart fs-6 fw-bolder " />
        </el-button>
        <span class="num"> {{ getCount(chirper.likeCount) }} </span></li>
      <li>
        <el-button circle class="btn-interact"  size="medium">
          <i class="bi bi-bar-chart fs-6 fw-bolder text-dark"></i>
        </el-button>

        <span class="num"> {{ getCount(chirper.viewCount) }}</span>
      </li>
      <li>
        <el-button circle class="btn-interact"  size="medium"
                   @click="copy('http://localhost:7878/chirper/detail?id='+chirper.id)">
          <i class="bi bi-share fs-6 fw-bolder text-dark"/>
        </el-button>
      </li>
    </ul>
  </el-row>
</template>

<script>
import {getCount} from "@/util/tools";
import {getToken} from "@/util/auth";
import {cancelForward, cancelLike, doLike, forwardChirper} from "@/api/chirper";
import QuoteCard from "@/views/edit/QuoteCard.vue";
import ReplyCard from "@/views/edit/ReplyCard.vue";
import {copy} from "@/util/clipboard";

export default {
  name: "ChirperClickBar",
  components: {
    'quote-card': QuoteCard,
    'reply-card': ReplyCard
  },
  props: {
    value: {}
  },
  data() {
    return {
      chirper: {
        id: '',
        replyCount: '',
        forwardCount: '',
        quoteCount: '',
        likeCount: '',
        viewCount: '',
        isLike: Boolean,
        isForward: Boolean,
        isQuote: Boolean
      },
      quoteDialog: false,
      replyDialog: false
    }
  },
  methods: {
    copy,
    getToken,
    getCount,
    doLike() {
      if (!this.chirper.isLike) {
        this.chirper.likeCount++;
        //点赞也可以增加浏览量(互动值)
        this.chirper.viewCount++;
        this.chirper.isLike = true;
        doLike(this.chirper.id);
      } else {
        this.chirper.likeCount--;
        this.chirper.isLike = false;
        cancelLike(this.chirper.id);
      }
    },
    doForward() {
      if (!this.chirper.isForward) {
        forwardChirper(this.chirper.id).then(() => {
          this.chirper.isForward = true;
          this.chirper.forwardCount++;
          //转发也可以增加浏览量(互动值)
          this.chirper.viewCount++;
        })
      } else {
        cancelForward(this.chirper.id).then(() => {
          this.chirper.isForward = false;
          this.chirper.forwardCount--;
        })
      }
    }
  },
  watch: {
    value(val) {
      this.chirper = val
    }
  },
  created() {
    this.chirper = this.value;
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
  float: left;
  text-align: left;
  width: 20%;
  display: flex;
  align-items: center;
  color: #606266;

}

.num {
  font-size: 14px;
  line-height: 20px;
}

.btn-interact {
  border: none;
  font-size: 20px;
}

</style>
<style>

</style>
