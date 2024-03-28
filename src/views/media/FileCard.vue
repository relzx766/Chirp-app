<template>
  <div class="d-flex justify-content-center align-items-center" @click="handlerClick">
    <div v-if="category === fileCategoryEnums.IMAGE" class="d-flex">
      <el-image :src="url" class="d-flex" fit="container"></el-image>
    </div>
    <div v-else-if="category === fileCategoryEnums.VIDEO" class="w-100 h-100">
      <div id="player" class="w-100 h-100">
        <video
            ref="videoPlayer"
            class="video-js w-100 h-100 overflow-hidden"
        ></video>
      </div>
    </div>
    <div v-else class="w-100 h-100">
      <el-card shadow="hover" style="cursor: pointer" @click.native="download">
        <div class="row">
          <div class="col-8 d-flex flex-column">
            <span>
              {{ url }}
            </span>
            <span v-if="size" class="text-secondary">{{ sizeAsMb }}MB</span>
          </div>
          <div class="col text-end">
            <i :class="[icon.icon]" class="fs-2"/>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog
        v-if="previewList"
        :append-to-body="true"
        :destroy-on-close="true"
        :fullscreen="true"
        :visible.sync="previewDialog"
        custom-class="no-header-dialog d-flex justify-content-center align-items-center"
    >
      <div
          class="w-100 h-100 d-flex justify-content-between align-items-center"
      >
        <el-button
            :disabled="previewIndex <= 0"
            circle
            type="info"
            @click="handlerPreviewLast"
        >
          <i class="bi bi-arrow-left"/>
        </el-button>
        <div class="w-75 h-75 d-flex justify-content-center align-items-center">
          <file-card
              :key="previewList[previewIndex].url"
              :size="size"
              :type="previewList[previewIndex].type"
              :url="previewList[previewIndex].url"
              class="w-100"
          />
        </div>
        <el-button
            :disabled="previewIndex >= previewList.length - 1"
            circle
            type="info"
            @click="handlerPreviewNext"
        >
          <i class="bi bi-arrow-right"/>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getCategory} from "@/util/tools";
import {fileCategoryEnums} from "@/enums/enums";
import VClamp from "vue-clamp";

export default {
  name: "FileCard",
  components: {VClamp},
  props: {
    url: String,
    type: String,
    previewList: Array,
    size: Number,
    index: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    fileCategoryEnums() {
      return fileCategoryEnums;
    },
    extension() {
      if (!this.type) {
        return this.url.substring(this.url.lastIndexOf(".") + 1);
      }
      return this.type.split("/").pop();
    },
    icon() {
      return this.fileIcon[this.extension]
          ? this.fileIcon[this.extension]
          : this.fileIcon.default;
    },
    category() {
      return getCategory(this.extension);
    },
    sizeAsMb() {
      if (this.size) {
        return (this.size / 1024 / 1024).toFixed(1);
      }
      return 0;
    },
    videoOption() {
      let option = {
        controls: true, // 是否显示底部控制栏
        preload: "auto", // 加载<video>标签后是否加载视频
        autoplay: "muted", // 静音播放
        fluid: true, //自适应
        playbackRates: [0.5, 1, 1.5, 2], // 倍速播放
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
              inline: false,
            },
            {name: "pictureInPictureToggle"}, //画中画播放模式
            {name: "fullscreenToggle"},
          ],
        },
        sources: [
          // 指定视频的类型和链接
        ],
      };
      if (this.type) {
        option.sources = [{type: this.type, src: this.url}];
      } else {
        option.sources = [{src: this.url}];
      }
      return option;
    },
    previewable() {
      const category = getCategory(this.extension);
      return (
          (category === fileCategoryEnums.IMAGE ||
              category === fileCategoryEnums.VIDEO) &&
          this.previewList &&
          this.previewList.length > 0
      );
    },
    currentPreview() {
      return this.previewList[this.previewIndex];
    },
  },
  data() {
    return {
      fileIcon: {
        default: {
          icon: "bi-file-earmark",
        },
        apk: {
          icon: "bi-android",
        },
        exe: {
          icon: "bi-filetype-exe",
        },
        text: {
          icon: "bi-file-text",
        },
        zip: {
          icon: "bi-file-zip-fill",
        },
        word: {
          icon: "bi-file-earmark-word-fill",
        },
        excel: {
          icon: "bi-file-earmark-excel-fill",
        },
        ppt: {
          icon: "file-earmark-ppt-fill",
        },
        pdf: {
          icon: "file-earmark-pdf-fill",
        },
      },
      player: null,
      previewDialog: false,
      previewIndex: 0,
    };
  },
  methods: {
    download() {
      window.location.href = this.url;
    },
    handlerClick() {
      if (this.previewable) {
        this.previewDialog = true;
      }
    },
    handlerPreviewLast() {
      if (this.previewIndex > 0) {
        this.previewIndex--;
      }
    },
    handlerPreviewNext() {
      if (this.previewIndex < this.previewList.length - 1) {
        this.previewIndex++;
      }
    },
  },
  created() {
    this.previewIndex = this.index;
  },
  mounted() {
    if (this.category === fileCategoryEnums.VIDEO) {
      this.player = this.$video(
          this.$refs.videoPlayer,
          this.videoOption,
          function onPlayerReady() {
          }
      );
    }
  },
  updated() {

  },
  destroyed() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>
<style scoped>
video {
  object-fit: cover;
}
</style>
