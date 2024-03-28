<template>
  <div class="container vh-100 ">
    <div class="row  h-100">
      <div class="col-5 p-0 border-start border-end">
        <div class="text-start p-2 ps-3  fs-5 fw-bold text-dark">设置</div>
        <el-input
            v-model="keyword"
            class="p-2 mb-2"
            placeholder="搜索设置"
            prefix-icon="el-icon-search"
        />

        <div class="text-start  setting-item finger fs-6">
          <div v-for="item in menu" :key="item.title">
            <div :class="getCardClass(`${item.path}`)"
                 class=" p-3  d-flex  justify-content-between"
                 @click="$router.push(`${item.path}`)">
              <span>{{ item.title }}</span><i class="bi bi-chevron-right"/></div>
          </div>
          <div v-show="keyword.trim().length>0&&menu.length===0" class="ps-5 pt-2">
            <div class="text-dark fw-bold fs-3">No result for {{ keyword }}</div>
            <div class="text-secondary fs-7">尝试输入其他关键词</div>
          </div>
        </div>
      </div>
      <div class="col border-end">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script>
import InputCard from "@/views/search/InputCard.vue";
import {mapState} from "vuex";

export default {
  name: "Setting",
  components: {InputCard},
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapState({
      setting: state => state.menu.setting
    }),
    menu() {
      if (this.keyword.trim().length === 0) {
        return Object.values(this.setting.children)

      } else {
        return this.findSetting();
      }
    }
  },
  methods: {
    getCardClass(name) {
      return this.$route.path === name ? ['bg-focus-1', "border-2", "border-end", "border-primary"] : [];
    },
    findSetting() {
      let menu = [];
      const find = (item) => {
        if (item.title && item.title.indexOf(this.keyword.trim()) > -1) {
          menu.push(item);

        }
        if (item.children && Object.keys(item.children).length > 0) {
          for (let s in item.children) {
            const i = item.children[s];
            //递归查找
            find(i);
          }
        }
      }
      find(this.setting);
      return menu;
    }
  },
}
</script>
<style scoped>
::v-deep .el-input__inner {
  border-radius: 23px;
}

.setting-item :hover {
  background-color: #ecf4f4;
}

::v-deep .el-input__prefix {
  margin-left: 10px;
}

</style>