<template>
  <div>
    <video-player v-if="category==='video'" :url="media[0].url" style="width:90%"/>


    <waterfall v-else-if="category==='image'" :col="media.length>2?2:media.length" :data="media" :isTransition="false"
               style="width: 90%;overflow: hidden">
      <el-image v-for="(item,index) in media" :key="item.name"
                :preview-src-list="getUrls"
                :src="item.url"
                :style="{width:'99%',
             marginTop:index>1?'4px':'0px',
             height:media.length>1?'200px':'auto' }"
                fit="cover"
                style="border-radius: 14px;">
      </el-image>
    </waterfall>


  </div>

</template>

<script>
import VideoPlayer from "@/views/media/VideoPlayer.vue";

export default {
  name: "MediaCard",
  props: {
    media: Array
  },

  components: {
    VideoPlayer
  },
  data() {
    return {
      category: "",
      dynamicHeight: ""
    }
  },
  computed: {
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
    }
  },
  methods: {
    init() {
      this.category = this.media[0].category;
    },
    getMargin(index) {
      index++;
      if ((index % this.media.length) !== 1) {
        let col = this.media.length > 3 ? 3 : this.media.length;
        col = Math.min(col, this.media.length);
        col--;
        return `${1 / col}%`;
      }
      return '0%';
    }
  },
  created() {
    this.init();
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
  float: left;
}
</style>
