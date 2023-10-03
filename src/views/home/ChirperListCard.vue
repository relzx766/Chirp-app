<template>
  <el-container>
    <el-main>
      <el-row>
        <el-row>
          <span style="float: left;font-weight: bold;font-size: 20px">主页</span>
        </el-row>
        <el-row>
          <el-tabs v-model="active" :stretch="true">
            <el-tab-pane name="recommend">
              <span slot="label" style="font-size: 16px;font-weight: bold;">为你推荐</span>
              <edit-card v-if="isLogin"
                         style="border-bottom: 2px solid #EBEEF5;"/>
              <el-row v-if="recommend.isLoading" style="text-align: center">
                <div class="loading-box">
                  <div class="loading"/>
                </div>
              </el-row>
              <el-row v-for="item in recommend.chirper" style="border-bottom: 1px solid #E4E7ED;">
                <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                            :value="item" style="margin-top: 8px;"/>
                <chirper-card
                    v-else :chirper="item"
                    style="margin-top: 8px;"/>
              </el-row>
              <el-row>
                <span v-if="recommend.isBottom" style="color:#909399;">到底了</span>
              </el-row>
            </el-tab-pane>
            <el-tab-pane :disabled="!isLogin" name="following">
              <span slot="label" style="font-size: 16px;font-weight: bold;">正在关注</span>
              <el-button v-if="updateAdvice.visible" class="btn-advice-update" icon="el-icon-top" round type="primary"
                         @click="toFollowingTop">
                最新{{ updateAdvice.record.length }}条推文
              </el-button>
              <edit-card v-if="isLogin"
                         style="border-bottom: 2px solid #EBEEF5;"/>
              <el-row v-if="following.isLoading" style="text-align: center">
                <div class="loading-box">
                  <div class="loading"/>
                </div>
              </el-row>
              <el-row v-for="item in following.chirper" style="border-bottom: 1px solid #E4E7ED;">
                <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                            :value="item" style="margin-top: 8px;"/>
                <chirper-card
                    v-else :chirper="item"
                    style="margin-top: 8px;"/>
              </el-row>
              <el-row>
                <span v-if="following.isBottom" style="color:#909399;">已没有更多</span>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-row>
    </el-main>
  </el-container>
</template>


<script>
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import {getByIds, getChirperPage} from "@/api/chirper";
import OriginCard from "@/views/edit/OriginCard.vue";
import ReferCard from "../chirper/ReferCard.vue";
import {bigNumberToString, getToken} from "@/util/tools";
import {getPage} from "@/api/feed";

export default {
  name: "ChirperListCard",
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
    refreshPage() {
      this.following.page = 1;
      this.following.isBottom = false;
      this.following.isLoading = true;
      this.following.chirper = [];
      getPage(this.following.page).then(res => {
        this.following.isBottom = res.data.record.length <= 0;
        let ids = res.data.record.map(feed => feed.contentId);
        if (ids.length > 0) {
          getByIds(ids).then(r => {
            this.following.chirper.push(...r.data.record);
            this.following.isLoading = false;
          })
        }
      });
      this.recommend.page = 1;
      this.recommend.isBottom = false
      this.recommend.isLoading = true;
      this.recommend.chirper = [];
      getChirperPage(this.recommend.page).then(res => {
        this.recommend.chirper.push(...res.data.record);
        this.recommend.isBottom = res.data.record.length <= 0;
        this.recommend.isLoading = false;
      })
    },
    loadPage() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight) {
        if (this.active === 'following' && !this.following.isBottom && !this.following.isLoading) {
          this.following.page++;
          this.following.isLoading = true;
          //当feed流更新后，这种方式获取会导致重复
          getPage(this.following.page).then(res => {
            this.following.isBottom = res.data.record.length <= 0;
            let ids = res.data.record.map(feed => feed.contentId)
            if (ids.length > 0) {
              getByIds(ids).then(r => {
                this.following.chirper.push(...r.data.record);
                this.following.isLoading = false
              })
            } else {
              this.following.isLoading = false;
            }
          })
        } else if (this.active === 'recommend' && !this.recommend.isLoading && !this.recommend.isBottom) {
          this.recommend.page++;
          this.recommend.isLoading = true;
          getChirperPage(this.recommend.page).then(res => {
            this.recommend.chirper.push(...res.data.record);
            this.recommend.isBottom = res.data.record.length <= 0;
            this.recommend.isLoading = false;
          })
        }
      }
    },
    toFollowingTop() {
      this.updateAdvice.visible = false;
      document.documentElement.scrollTop = 0;
      getPage(1).then(res => {
        let ids = res.data.record.map(feed => feed.contentId)
        getByIds(ids).then(r => {
          this.following.chirper.unshift(...r.data.record)
        })
      })
    }
  },
  components: {
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
      },
      immediate: true
    }
  },
  created() {
    this.refreshPage();
    window.addEventListener("scroll", this.loadPage, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadPage);
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
      #4d72f6 0, #4d72f6 64%,
      transparent 0, transparent
  );
}

</style>
