<template>
  <el-container >
    <el-main class="content" style="padding: 0">
      <el-row>
        <el-row>
          <span style="float: left;font-weight: bold;font-size: 20px">主页</span>
        </el-row>
        <el-row>
          <el-tabs v-model="active" :stretch="true" @tab-click="doTapClick">
            <el-tab-pane name="recommend" >
              <span slot="label" style="font-size: 16px;font-weight: bold;">为你推荐</span>
              <edit-card v-if="isLogin"
                         style="border-bottom: 2px solid #EBEEF5;"/>

              <el-row v-for="item in recommend.chirper" :key="item.id" style="border-bottom: 1px solid #E4E7ED;">
                <refer-card v-if="item.type===chirperTypeEnums.FORWARD||item.type===chirperTypeEnums.QUOTE" :barVisible="item.type!==chirperTypeEnums.FORWARD"
                            :value="item" style="margin-top: 8px;"/>
                <chirper-card
                    v-else :chirper="item"
                    style="margin-top: 8px;"/>
              </el-row>
              <infinite-loading
                  direction="bottom"
                  ref="inf-recommend"
                  @infinite="loadRecommend">
              </infinite-loading>
            </el-tab-pane>
            <el-tab-pane :disabled="!isLogin" name="following" >
              <span slot="label" style="font-size: 16px;font-weight: bold;">正在关注</span>
              <el-button v-if="updateAdvice.visible" class="btn-advice-update" icon="el-icon-top" round type="primary"
                         @click="toFollowingTop">
                查看最新推文
              </el-button>
              <edit-card v-if="isLogin"
                         style="border-bottom: 2px solid #EBEEF5;"/>
              <el-row v-for="item in following.chirper" :key="item.id"
                      style="border-bottom: 1px solid #E4E7ED;">
                <refer-card v-if="item.type===chirperTypeEnums.FORWARD||item.type===chirperTypeEnums.QUOTE" :barVisible="item.type!==chirperTypeEnums.FORWARD"
                            :value="item" style="margin-top: 8px;"/>
                <chirper-card
                    v-else :chirper="item"
                    style="margin-top: 8px;"/>
              </el-row>
              <infinite-loading
                  direction="bottom"
                  ref="inf-following"
                  @infinite="loadFollowingChirper">
              </infinite-loading>
            </el-tab-pane>
          </el-tabs>
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
import InfiniteLoading, {StateChanger} from "vue-infinite-loading";
import {getToken} from "@/util/auth";
import {chirperTypeEnums} from "@/enums/enums";
export default {
  name: "ChirperListCard",
  computed: {
    chirperTypeEnums() {
      return chirperTypeEnums
    }
  },
  props: {
    isLogin: Boolean
  },
  data() {
    return {
      active: "recommend",
      chirper: [],
      recommend: {
        chirper: [],
        isLoading: false,
        isBottom: false,
        page: 1
      },
      following: {
        chirper: [],
        isLoading: false,
        isBottom: false,
        page: 1,
        updateAdvice: {
          record: [],
          visible: true
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
    doTapClick(){
      if (this.active === "recommend"){
        //主动触发infinite-loading的加载方法
        this.loadRecommend(null);
      }else if (this.active === "following"){
        this.loadFollowingChirper(null);
      }
    },
    loadRecommend($state){
      getChirperPage(this.recommend.page).then(res => {
        if (res.code===200) {
          this.recommend.page++;
          if (res.data.record.length > 0) {
            this.recommend.chirper.push(...res.data.record);
            $state && $state.loaded();
          } else {
            $state && $state.complete();
          }
        }
      })
    },
    init(){
      getPage(1).then(res => {
        let ids = res.data.record.map(feed => feed.contentId)
        if (ids.length > 0) {
          getByIds(ids).then(r => {
            if (r.code===200) {
              this.following.chirper.push(...r.data.record);
            }
          });
        }
      })
    },
    loadFollowingChirper($state) {
      if (this.following.chirper.length>0) {
        let start = this.following.chirper[this.following.chirper.length - 1].createTime;
        start = Date.parse(start);
        getPageByScore(start).then(res => {
          let ids = res.data.record.map(feed => feed.contentId);
          if (ids.length > 0) {
            getByIds(ids).then(r => {
              if (r.code===200) {
                this.following.chirper.push(...r.data.record);
              }
              $state && $state.loaded();
            });
          } else {
            $state && $state.complete();
          }
        });
      }else {
        this.init();
      }
    },
    toFollowingTop() {
      this.updateAdvice.visible = false;
      this.updateAdvice.record = [];
      document.documentElement.scrollTop = 0;
      let start =this.following.chirper.length>0?this.following.chirper[0].createTime:0;
      start=Date.parse(start)+1;
      let end=Date.now();
      getRange(start,end).then(res=>{
        let ids = res.data.record.map(feed => feed.contentId)
        getByIds(ids).then(r => {
          if (r.code===200) {
            this.following.chirper.unshift(...r.data.record);
          }
        })
      });
    }
  },
  components: {
    InfiniteLoading,
    'edit-card': OriginCard,
    'chirper-card': ChirperCard,
    'refer-card': ReferCard
  },
  watch: {
    '$store.state.followingUpdate.count': {
      handler() {
        let record = this.$store.getters.popFollowingUpdate;
        if (record.length > 0) {
          if (this.updateAdvice.visible) {
            this.updateAdvice.record.unshift(record);
          } else {
            this.updateAdvice.record = record;
          }
          this.updateAdvice.visible = true;
        }
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
