<template>
  <el-container>
    <el-main>
      <el-row>
        <el-row>
          <span style="float: left;font-weight: bold;font-size: 20px">主页</span>
        </el-row>
        <el-row>
          <el-tabs :stretch="true" value="forYou" @tab-click="refreshPage">
            <el-tab-pane name="forYou">
              <span slot="label" style="font-size: 16px;font-weight: bold;">为你推荐</span>
              <edit-card v-if="isLogin"
                         style="border-bottom: 2px solid #EBEEF5;"/>
              <el-row v-if="isLoading" style="text-align: center">
                <div class="loading-box">
                  <div class="loading"/>
                </div>
              </el-row>
              <el-row v-for="item in chirper" :key="chirper.id" style="border-bottom: 1px solid #E4E7ED;">
                <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                            :value="item" style="margin-top: 8px;"/>
                <chirper-card
                    v-else :chirper="item"
                    style="margin-top: 8px;"/>
              </el-row>
              <el-row>
                <span v-if="isBottom" style="color:#909399;">到底了</span>
              </el-row>
            </el-tab-pane>
            <el-tab-pane :disabled="!isLogin" name="following">
              <span slot="label" style="font-size: 16px;font-weight: bold;">正在关注</span>
              <edit-card v-if="isLogin"
                         style="border-bottom: 2px solid #EBEEF5;"/>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-row>
    </el-main>
  </el-container>
</template>


<script>
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import {getChirperPage} from "@/api/chirper";
import OriginCard from "@/views/edit/OriginCard.vue";
import ReferCard from "../chirper/ReferCard.vue";
import {getToken} from "@/util/tools";

export default {
  name: "ChirperListCard",
  props: {
    isLogin: Boolean
  },
  data() {
    return {
      chirper: [],
      page: 1,
      isLoading: false,
      isBottom: false
    }
  },
  methods: {
    getToken,
    refreshPage() {
      this.page = 1;
      this.isBottom = false;
      this.isLoading = true;
      let startTime = Date.now();
      this.getChirper(1).then((record) => {
        let loadTime = Date.now() - startTime;
        if (loadTime < 1000) {
          setTimeout(() => {
            this.chirper = record;
            this.isLoading = false;
          }, 1000 - loadTime);
        } else {
          this.chirper = record;
          this.isLoading = false;
        }
      })
    },
    loadPage() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isBottom && !this.isLoading) {
        this.page++;
        this.isLoading = true;
        this.getChirper(this.page).then((data) => {
          this.isBottom = data.length <= 0;
          this.chirper.push(...data);
          this.isLoading = false;
        })
      }
    },
    async getChirper(page) {
      let chirpers = (await getChirperPage(page)).data.record;
      return chirpers.map(chirper => {
        chirper.mediaKeys = JSON.parse(chirper.mediaKeys);
        return chirper;
      });
    }
  },
  components: {
    'edit-card': OriginCard,
    'chirper-card': ChirperCard,
    'refer-card': ReferCard
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