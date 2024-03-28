<template>
  <div class="row">
    <div :class="getToken()===null||!chirper.replyable?['text-secondary']:['text-dark']" class="col">
      <el-button :disabled="getToken()===null||!chirper.replyable"
                 circle class="btn-interact"
                 size="medium" @click.stop="replyDialog=true">
        <i class="bi bi-chat fs-6 fw-bolder"/>
      </el-button>
      <el-dialog
          :modal="false"
          :show-close="false"
          :visible.sync="replyDialog"
          width="50%" @click.native.self=({})>
        <el-row class="p-2">
          <reply-card :chirper="chirper" :is-dia-log="true"
                      @sent="replyDialog=false;chirper.replyCount++;chirper.viewCount++"/>
        </el-row>
      </el-dialog>
      <span class="num">{{ getCount(chirper.replyCount) }}</span></div>
    <div class="col">

      <el-popover
          :visible-arrow="false"
          placement="top"
          popper-class="consumer-popper"
          trigger="click"
          width="auto"

      >
        <el-row>
          <el-row>
            <el-button :class="chirper.isForward?['text-success']:['text-dark']"
                       :disabled="!chirper.forwardable"
                       class="btn-interact"
                       size="medium" style="font-size: 16px" @click="doForward()">
              <i :class="chirper.isForward?['text-success']:['text-dark']"
                 class="bi bi-arrow-repeat  fw-bolder me-2"/>
              <span
              >转发</span></el-button>
          </el-row>
          <el-row>
            <el-button :class="chirper.isQuote?['text-primary']:['text-dark']"
                       :disabled="!chirper.quotable" class="btn-interact"
                       size="medium"
                       style="font-size: 16px"
                       @click="quoteDialog=true">
              <i :class="chirper.isQuote?['text-primary']:['text-dark']"
                 class="bi bi-pencil-square  fw-bolder me-2"
              />
              <span
              >引用</span></el-button>
          </el-row>
          <el-dialog
              :modal="false"
              :show-close="false"
              :visible.sync="quoteDialog"
              width="50%">
            <el-row class="p-2">
              <quote-card :chirper="chirper"
                          @sent="quoteDialog=false;chirper.isQuote=true;chirper.quoteCount++;chirper.viewCount++;"/>
            </el-row>
          </el-dialog>
        </el-row>
        <el-button slot="reference" :class="(chirper.isForward||chirper.isQuote)?['text-success']:['text-dark']"
                   :disabled="getToken()===null||(!chirper.forwardable&&!chirper.quotable)"
                   circle
                   class="btn-interact"
                   size="medium">
          <i class="bi bi-arrow-repeat fs-6 fw-bolder "/>
        </el-button>
      </el-popover>
      <span class="num">{{ getCount(chirper.forwardCount + chirper.quoteCount) }}</span>

    </div>
    <div class="col">
      <el-button :class="chirper.isLike?['text-danger']:['text-dark']"
                 :disabled="getToken()===null||!chirper.likeable" circle
                 class="btn-interact"
                 size="medium"
                 @click.stop="doLike()">
        <i v-if="chirper.isLike" class="bi bi-heart-fill fs-6 fw-bolder "/>
        <i v-else class="bi bi-heart fs-6 fw-bolder "/>
      </el-button>
      <span class="num"> {{ getCount(chirper.likeCount) }} </span></div>
    <div class="col">
      <el-button circle class="btn-interact" size="medium">
        <i class="bi bi-reception-4 fs-6 fw-bolder text-dark"></i>
      </el-button>

      <span class="num"> {{ getCount(chirper.viewCount) }}</span>
    </div>
    <div class="col">
      <el-button circle class="btn-interact" size="medium"
                 @click="copy('http://localhost:7878/chirper/detail?id='+chirper.id)">
        <i class="bi bi-share fs-6 fw-bolder text-dark"/>
      </el-button>
    </div>
  </div>
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
