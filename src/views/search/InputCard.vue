<template>
  <el-row>
    <el-input
        v-model="keyword"
        :clearable="true"
        placeholder="搜索"
        prefix-icon="el-icon-search"
        @keyup.enter.native="$router.push('/search?keyword='+keyword)"
    >
    </el-input>
  </el-row>
</template>

<script>
export default {
  name: "InputCard",
  data() {
    return {
      keyword: ''
    }
  }
}
</script>

<style scoped>
::v-deep .el-input__inner {
  border-radius: 23px;
  background-color: #EBEEF5;
  border: none;
  color: #5e6e7c;
}
::v-deep .el-input__inner:focus{border: 1px solid #409EFF}
::v-deep .el-input:focus-within  .el-input__icon {
  color: #409EFF;
}

</style>
