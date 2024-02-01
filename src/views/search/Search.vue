<template>
  <div class="container">
      <div class="row">
        <div class="col-8 border-start border-end p-2">
          <input-card style="margin-bottom: 8px"/>
          <el-tabs :stretch="true" value="all" class="d-flex flex-column" style="width: 100%" @tab-click="handleTabClick">
            <el-tab-pane name="all" >
              <span slot="label" style="font-size: 16px;font-weight: bold">全部</span>
              <div class="overflow-y-auto" style="flex: 1;height: 84vh">
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
              <div class="overflow-y-auto" style="flex: 1;height: 84vh">
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
              <search-user-card class="overflow-y-auto" style="flex: 1;height: 84vh" :keyword="keyword" :page="page"/>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="col text-center pt-2">
          <trend-list-card style="background-color:#EBEEF5;border-radius: 10px"/>
        </div>
      </div>
  </div>
</template>

<script>
import InputCard from "@/views/search/InputCard.vue";
import {search} from "@/api/chirper";
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
  data() {
    return {
      keyword: "",
      page: 1,
      isMedia: false,
      isLoading: true,
      isBottom: false,
      chirpers: []
    }
  },
  methods: {
    init() {
      this.page = 1;
      this.isMedia = false;
      this.isLoading = false;
      this.isBottom = false;
      this.chirpers.splice(0,this.chirpers.length);
      this.users = [];
    },
    handleTabClick(tab){
      if (tab.name==='all'){
        this.init();
        this.searchChirper();
      }else if (tab.name==='media'){
        this.init();
        this.isMedia=true;
        this.searchChirper();
      }
    },
    searchChirper() {
      this.isLoading = true;
      search(this.keyword, this.page, this.isMedia).then(res => {
        if (res.code===200) {
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
    }
  },
  watch: {
    $route(to) {
      this.init();
      this.keyword = to.query.keyword;
      this.searchChirper()
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
