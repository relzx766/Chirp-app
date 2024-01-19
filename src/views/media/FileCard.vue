<template>
<div class="w-100 h-100">
  <div v-if="category===fileCategoryEnums.IMAGE">
    <img :src="url" alt="图片"/>
  </div>
  <div v-if="category===fileCategoryEnums.VIDEO" class="w-100 h-100">
    <div id="player" class="w-100 h-100">
      <video ref="videoPlayer"  class="video-js w-100 h-100 rounded-2 overflow-hidden"></video>
    </div>
  </div>
  <div v-else class="w-100 h-100">
    <el-card shadow="hover" @click.native="download" style="cursor: pointer">
      <div class="row">
        <div class="col-8">
          <v-clamp autoresize :max-lines="2">
            {{url}}
          </v-clamp>
          </div>
        <div class="col text-end">
          <i :class="[icon.icon]" class="fs-2"/>
        </div>
      </div>
    </el-card>
  </div>
</div>
</template>
<script>
import {getCategory} from "@/util/tools";
import {fileCategoryEnums} from "@/enums/enums";
import VClamp from "vue-clamp";

export default {
  name: "FileCard",
  components: {VClamp},
  props:{
    url:String
  },
  computed:{
    fileCategoryEnums() {
      return fileCategoryEnums
    },
    extension(){
      return this.url.substring(this.url.lastIndexOf(".")+1);
    },
    icon(){
      return this.fileIcon[this.extension]?this.fileIcon[this.extension]:this.fileIcon.default;
    },
    category(){
      return  getCategory(this.extension);
    },
    videoOption(){
      return {
        controls: true, // 是否显示底部控制栏
        preload: "auto", // 加载<video>标签后是否加载视频
        autoplay: "muted", // 静音播放
        playbackRates: [0.5, 1, 1.5, 2],// 倍速播放
        controlBar: {
          // 自定义按钮的位置
          children: [
            {name: "playToggle"},
            {name: "progressControl"},
            {name: "currentTimeDisplay"},
            {name: "timeDivider"},
            {name: "durationDisplay"},
            {
              name: "volumePanel", // 音量调整方式横线条变为竖线条
              inline: false
            },
            {name: "pictureInPictureToggle"}, //画中画播放模式
            {name: "fullscreenToggle"},
          ],
        },
        sources: [
          // 指定视频的类型和链接
          {
            src: this.url,
          },
        ],
      };
    }
  },
  data(){
    return{
      fileIcon:{
        default:{
          icon:'bi-file-earmark'
        },
        apk:{
          icon:'bi-android'
        },
        exe:{
          icon:'bi-filetype-exe'
        },
        text:{
          icon:'bi-file-text'
        },
        zip:{
          icon:'bi-file-zip-fill'
        },
        word:{
          icon:'bi-file-earmark-word-fill'
        },
        excel:{
          icon:'bi-file-earmark-excel-fill'
        },
        ppt:{
          icon:'file-earmark-ppt-fill'
        },
        pdf:{
          icon:'file-earmark-pdf-fill'
        }
      },
      player:null
    }
  },
  methods:{
    download(){
      window.location.href=this.url;
    }
  },
  created() {
  },
  mounted() {
    if (this.category===fileCategoryEnums.VIDEO){
      this.player = this.$video(this.$refs.videoPlayer, this.videoOption, function onPlayerReady() {
      });
    }
  },
  destroyed() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>
<style scoped>
video {
  object-fit: cover;
}
</style>