<template>
  <div class="container vh-100 ">
    <div v-if="$route.path===`${accountMenu.path}`" class="row  h-100">
      <div class="col p-0">
        <div class="text-start p-2 ps-3  fs-5 fw-bold text-dark">你的账号</div>
        <div class="text-start fs-7 text-secondary p-3">{{ accountMenu.placeholder }}</div>

        <div class="text-start  setting-item finger fs-6">
          <div v-for="item in accountMenu.children" :key="item.title">
            <div class=" p-3  row d-flex align-items-center"
                 @click="$router.push(`${item.path}`)">
              <div class="col-1 text-center"><i :class="['bi',`${item.icon}`]"/></div>
              <div class="col-10 text-start d-flex flex-column justify-content-center">
                <div>{{ item.title }}</div>
                <div class="fs-7 text-secondary">{{ item.placeholder }}</div>
              </div>
              <div class="col-1 text-end"><i class="bi bi-chevron-right"/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view v-else/>
  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  name: "Account",
  computed: {
    ...mapState({
      menu: state => state.menu,
      accountMenu: state => state.menu.setting.children.account
    })
  }
}
</script>
<style scoped>
.setting-item :hover {
  background-color: #ecf4f4;
}
</style>