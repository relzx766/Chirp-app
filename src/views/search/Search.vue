<template>
  <div class="container">
    <div class="row">
      <div class="col border-start border-end p-2">
        <input-card style="margin-bottom: 8px"/>
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
          <div v-if="switchType===switchOptions.All">
            <el-row v-if="isLoading" style="text-align: center">
              <div class="loading-box">
                <div class="loading"/>
              </div>
            </el-row>
            <search-user-card :keyword="keyword"/>
            <el-row v-for="item in chirpers" style="border-bottom: 1px solid #E4E7ED;">
              <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                          :value="item" style="margin-top: 8px;"/>
              <chirper-card
                  v-else :chirper="item"
                  style="margin-top: 8px;"/>
            </el-row>
          </div>
          <div v-else-if="switchType===switchOptions.Media">
            <el-row v-for="item in chirpers" style="border-bottom: 1px solid #E4E7ED;">
              <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                          :value="item" style="margin-top: 8px;"/>
              <chirper-card
                  v-else :chirper="item"
                  style="margin-top: 8px;"/>
            </el-row>
          </div>
          <div v-else-if="switchType===switchOptions.User">
            <search-user-card :keyword="keyword" :page="page"/>

          </div>
        </div>
<!--        <el-tabs :stretch="true" style="width: 100%" value="all" @tab-click="handleTabClick">
          <el-tab-pane name="all">
            <span slot="label" style="font-size: 16px;font-weight: bold">全部</span>
            <div>
              <div>
                <el-row v-if="isLoading" style="text-align: center">
                  <div class="loading-box">
                    <div class="loading"/>
                  </div>
                </el-row>
                <search-user-card :keyword="keyword"/>
                <el-row v-for="item in chirpers" style="border-bottom: 1px solid #E4E7ED;">
                  <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                              :value="item" style="margin-top: 8px;"/>
                  <chirper-card
                      v-else :chirper="item"
                      style="margin-top: 8px;"/>
                </el-row>
              </div>

            </div>
          </el-tab-pane>
          <el-tab-pane name="media">
            <span slot="label" style="font-size: 16px;font-weight: bold">媒体</span>
            <div>
              <el-row v-for="item in chirpers" style="border-bottom: 1px solid #E4E7ED;">
                <refer-card v-if="item.type==='FORWARD'||item.type==='QUOTE'" :barVisible="item.type!=='FORWARD'"
                            :value="item" style="margin-top: 8px;"/>
                <chirper-card
                    v-else :chirper="item"
                    style="margin-top: 8px;"/>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane name="user">
            <span slot="label" style="font-size: 16px;font-weight: bold">用户</span>
            <search-user-card :keyword="keyword" :page="page"/>
          </el-tab-pane>
        </el-tabs>-->
      </div>
      <div class="col text-center pt-2">
        <trend-list-card class=" bg-info-2  rounded-4"/>
      </div>
    </div>
  </div>
</template>

<script>
import InputCard from "@/views/search/InputCard.vue";
import {getChirperPage} from "@/api/chirper";
import ChirperCard from "@/views/chirper/ChirperCard.vue";
import ReferCard from "@/views/chirper/ReferCard.vue";
import SearchUserCard from "@/views/search/SearchUserCard.vue";
import TrendListCard from "@/views/explore/TrendListCard.vue";

export default {
  name: "Search",
  components: {
    InputCard,
    ChirperCard,
    ReferCard,
    SearchUserCard,
    TrendListCard
  },
  computed: {
    switchType() {
      return this.$route.query.type ? this.$route.query.type : this.switchOptions.All;
    },
    keyword() {
      return this.$route.query.keyword;
    }
  },
  data() {
    return {
      page: 1,
      isMedia: false,
      isLoading: true,
      isBottom: false,
      chirpers: [],
      switchOptions: {
        All: 'All',
        Media: 'Media',
        User: 'User'
      }
    }
  },
  methods: {
    init() {
      this.page = 1;
      this.isMedia = false;
      this.isLoading = false;
      this.isBottom = false;
      this.chirpers.splice(0, this.chirpers.length);
      this.users = [];
    },
    handleTabClick() {
      const type = this.switchType;
      if (type === this.switchOptions.All) {
        this.init();
        this.searchChirper();
      } else if (type === this.switchOptions.Media) {
        this.init();
        this.isMedia = true;
        this.searchChirper();
      }
    },
    searchChirper() {
      this.isLoading = true;

      getChirperPage({
        keyword: this.keyword,
        page: this.page,
        media: this.switchType === this.switchOptions.Media
      }).then(res => {
        if (res.code === 200) {
          this.chirpers.push(...res.data.record);
          this.isBottom = res.data.record.length <= 0;
          this.isLoading = false;
        }
      })
    },
    loadMore() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollTop + clientHeight + 10 >= scrollHeight && !this.isBottom && !this.isLoading) {
        this.page++;
        this.searchChirper();
      }
    },
    switchTo(type) {
      this.$router.push(`/search?keyword=${encodeURIComponent(this.keyword)}&type=${type}`);
    }
  },
  watch: {
    $route() {
      this.init();
      this.searchChirper();
    }
  },
  created() {
    this.keyword = this.$route.query.keyword;
    this.searchChirper();
    window.addEventListener("scroll", this.loadMore, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadMore)
  }
}
</script>

<style scoped>
::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
  background-image: linear-gradient(
      90deg, transparent 0, transparent 32%,
      #4d72f6 0, #4d72f6 68%,
      transparent 0, transparent
  );
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
</style>
