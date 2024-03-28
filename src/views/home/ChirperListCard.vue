<template>
  <el-container>
    <el-main class="content p-0">
      <el-row>
        <el-row>
          <span
              class="float-start fw-bold fs-5">主页</span>
        </el-row>
        <el-row>
          <div
              class=" d-flex flex-nowrap align-self-center justify-content-around option-item fw-bold text-dark border-bottom">
            <div v-for="item in switchOptions"
                 class="flex-grow-1 pt-3 pb-3 fs-7 text-center position-relative user-select-none finger"
                 @click="switchTo(item)">
              <div>{{ item }}</div>
              <div v-if="switchType===item"
                   class="w-30 position-absolute bottom-0 start-50 translate-middle-x switch-btn-bottom bg-primary rounded-pill">
              </div>
            </div>
          </div>
          <div>
            <div>
              <edit-card v-if="isLogin&&switchType===switchOptions.Recommend"
                         class="border-bottom p-2 "/>
            </div>
            <div>
              <el-button v-if="updateAdvice.visible" class="btn-advice-update p-1" round type="primary"
                         @click="toFollowingTop">
                <div class="d-inline-flex align-items-center">
                  <div class="d-inline">
                    <el-avatar v-for="(item,index) in updateAdvice.record"
                               :key="item.id"
                               :class="index<updateAdvice.record.length-1?['med-1']:['me-1']"
                               :src="item.senderAvatar"
                               size="small"/>
                  </div>

                  <div class="d-inline"><span>更新推文</span></div>
                </div>
              </el-button>
              <div v-for="item in records[switchType].record" :key="item.id" class="border-bottom">
                <refer-card v-if="item.type===chirperTypeEnums.FORWARD||item.type===chirperTypeEnums.QUOTE"
                            :barVisible="item.type!==chirperTypeEnums.FORWARD"
                            :value="item" class="mt-2"/>
                <chirper-card
                    v-else :chirper="item"
                    style="margin-top: 8px;"/>
              </div>
              <infinite-loading
                  ref="inf-load"
                  direction="bottom"
                  @infinite="load">
              </infinite-loading>
            </div>
          </div>

        </el-row>
      </el-row>
      <el-backtop :right="480" target=".content"></el-backtop>
    </el-main>
  </el-container>
</template>


<script>
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import {getByIds, getChirperPage} from "@/api/chirper";
import OriginCard from "@/views/edit/OriginCard.vue";
import ReferCard from "../chirper/ReferCard.vue";
import {bigNumberToString} from "@/util/tools";
import {getPage, getPageByScore, getRange} from "@/api/feed";
import InfiniteLoading from "vue-infinite-loading";
import {getToken} from "@/util/auth";
import {chirperTypeEnums} from "@/enums/enums";
import {mapState} from 'vuex';
import {noticeMutations} from '@/config/vuex/mutation-types';

export default {
  name: "ChirperListCard",
  computed: {
    chirperTypeEnums() {
      return chirperTypeEnums
    },
    ...mapState({
      notice: state => state.notice
    }),
    switchType(){
      return this.$route.query.type?this.$route.query.type:this.switchOptions.Recommend;
    }
  },
  props: {
    isLogin: Boolean
  },
  data() {
    return {
      switchOptions:{
        Recommend:'Recommend',
        Following:'Following'
      },
      records:{
        Recommend:{
          record:[],
          page:1,
          finished:false
        },
        Following:{
          record:[],
          page:1,
          finished:false
        }
      },
      page: 1,
      isLoading: false,
      isBottom: false,
      updateAdvice: {
        record: [],
        visible: false
      }
    }
  },
  methods: {
    bigNumberToString,
    getToken,

    load($state){

      if (this.switchType === this.switchOptions.Recommend) {
        //主动触发infinite-loading的加载方法
        this.loadRecommend($state);
      } else if (this.switchType === this.switchOptions.Following) {
        this.loadFollowingChirper($state);
      }
    },
    doTapClick() {
      if (this.switchType === this.switchOptions.Recommend) {
        //主动触发infinite-loading的加载方法
        this.loadRecommend(null);
      } else if (this.switchType === this.switchOptions.Following) {
        this.loadFollowingChirper(null);
      }
    },
    loadRecommend($state) {
      const record=this.records.Recommend;
      getChirperPage({page: record.page}).then(res => {
        if (res.code === 200) {
          record.page++;
          if (res.data.record.length > 0) {
           record.record.push(...res.data.record);
            $state && $state.loaded();
          } else {
            $state && $state.complete();
          }
        }
      }).catch(e => {
        this.$message.error(e);
        $state && $state.complete();
      })
    },
    init() {
      return getPage(1).then(res => {
        if (res.code === 200 && res.data.record.length > 0) {
          let ids = res.data.record.map(feed => feed.contentId)
          if (ids.length > 0) {
            getByIds(ids).then(r => {
              if (r.code === 200) {
                this.records.Following.record.push(...r.data.record);
              }
            });
          }
        }
      })
    },
    loadFollowingChirper($state) {
      const record=this.records.Following;
      if (record.record.length > 0) {
        let start = record.record[record.record.length - 1].createTime;
        start = Date.parse(start);
        getPageByScore(start).then(res => {
          let ids = res.data.record.map(feed => feed.contentId);
          if (ids.length > 0) {
            getByIds(ids).then(r => {
              if (r.code === 200 && r.data.record.length > 0) {
                record.record.push(...r.data.record);
              }
              $state && $state.loaded();
            });
          } else {
            $state && $state.complete();
          }
        });
      } else {
        this.init();
      }
    },
    toFollowingTop() {
      this.updateAdvice.visible = false;
      this.updateAdvice.record = [];
      document.documentElement.scrollTop = 0;
      const record=this.records.Following;
      let start = record.record.length > 0 ? record.record[0].createTime : 0;
      start = Date.parse(start) + 1;
      let end = Date.now();
      getRange(start, end).then(res => {
        let ids = res.data.record.map(feed => feed.contentId)
        getByIds(ids).then(r => {
          if (r.code === 200) {
            record.record.unshift(...r.data.record);
          }
        })
      });
    },
    switchTo(type){
      this.$router.push(`/home?type=${type}`);
    }
  },
  components: {
    InfiniteLoading,
    'edit-card': OriginCard,
    'chirper-card': ChirperCard,
    'refer-card': ReferCard
  },
  watch: {
    '$store.state.notice.online.counter': {
      handler() {
        let record = structuredClone(this.notice.online.TWEETED);
        //对同一发送者过滤
        let filter = {};
        for (const re in this.updateAdvice.record) {
          filter[this.updateAdvice.record[re].senderId] = 1;
        }
        for (const rec in record) {
          let r = record[rec]
          if (!filter[r.senderId]) {
            filter[r.senderId] = 1;
            if (this.updateAdvice.visible) {
              this.updateAdvice.record.unshift(r);
            } else {
              this.updateAdvice.record = [r];
            }
            //只保留三条
            if (this.updateAdvice.record.length > 3) {
              this.updateAdvice.record.pop();
            }
            this.updateAdvice.visible = true;
          }

        }
        this.$store.commit(`notice/${noticeMutations.CLEAR_TWEETED_NOTICE}`);
      }
    },
    $route(){
      if (this.records[this.switchType].page===1){
        this.load(null);
      }
    }
  },
  created() {
//    window.addEventListener("scroll", this.loadPage, true);
  },
  destroyed() {
    //  window.removeEventListener("scroll", this.loadPage);
  }
}
</script>

<style scoped>
.btn-advice-update {
  position: fixed;
  z-index: 999;
  width: 150px;
  left: calc(50% - 110px);
}

.loading {
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 2px solid #409EFF;
  border-top-color: transparent;
  border-radius: 100%;
  margin-top: 6px;
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

::v-deep .el-tabs__item {
  color: #8d8f94;
}

::v-deep .el-tabs__item.is-active {
  color: #303133;
}

::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
  background-image: linear-gradient(
      90deg, transparent 0, transparent 36%,
      #409EFF 0, #409EFF 64%,
      transparent 0, transparent
  );
}

</style>
