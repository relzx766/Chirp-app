<template>
  <div>
    <waterfall
        :col="media.length > 2 ? 2 : media.length"
        :data="media"
        :isTransition="false"
        class="overflow-hidden"
    >
      <file-card
          v-for="(item, index) in media"
          :key="item.url"
          :prewiew-list="getUrls"
          :style="{height:media.length>1?'200px':'auto'}"
          :url="item.url"
          style="width: 98%"
          class="rounded-4 overflow-hidden bg-danger m-1"
      />
      <!--    <el-image v-for="(item,index) in media" :key="item.name"
                :preview-src-list="getUrls"
                :src="item.url"
                :style="{width:'99%',marginTop:index>1?'4px':'0px',height:media.length>1?'200px':'auto'}"
                fit="cover"
                class="rounded-4">
      </el-image> -->
    </waterfall>
  </div>
</template>

<script>
import FileCard from "@/views/media/FileCard";
import {supportMediaTypeEnums} from "@/enums/enums";

export default {
  name: "MediaCard",
  props: {
    media: Array,
  },
  components: {
    FileCard,
  },
  data() {
    return {
      category: "",
      dynamicHeight: "",
    };
  },
  computed: {
    supportMediaTypeEnums() {
      return supportMediaTypeEnums;
    },
    getUrls() {
      let urls = [];
      for (let index = 0; index < this.media.length; index++) {
        const m = this.media[index];
        urls.push(m.url);
      }
      return urls;
    },
    dynamicWidth() {
      let width;
      switch (this.media.length) {
        case 1:
          width = 100;
          break;
        case 2:
          width = 49;
          break;
        case 3:
          width = 33;
          break;
        default:
          width = 0;
          break;
      }
      return `${width}%`;
    },
  },
  methods: {
    init() {
    },
    getMargin(index) {
      index++;
      if (index % this.media.length !== 1) {
        let col = this.media.length > 3 ? 3 : this.media.length;
        col = Math.min(col, this.media.length);
        col--;
        return `${1 / col}%`;
      }
      return "0%";
    },
  },
  created() {
    this.init();
  },
};
</script>

<style scoped>
li {
  list-style-type: none;
  float: left;
}
</style>
