<template>
  <div>
    <div id="player">
      <video ref="videoPlayer" :style="videoStyle" class="video-js"></video>
    </div>
  </div>
</template>

<script>
import DPlayer from 'dplayer'

export default {
  name: "VideoPlayer",
  props: {
    url: "",
    videoStyle:{
      type:Object,
      default:()=>({
        'borderRadius':'12px',

      })
    }
  },
  data() {
    return {
      player: null
    }
  },
  methods: {
  },
  mounted() {
    // 播放参数
    let options = {
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
    this.player = this.$video(this.$refs.videoPlayer, options, function onPlayerReady() {
      console.log("onPlayerReady", this);
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>

<style scoped>
#player {
}

.video-js {
  width: 100%;
  overflow: hidden;
  min-height: 200px;
  max-height: 500px;
}

::v-deep .video-js.vjs-time-control {
  display: block;
}

::v-deep .video-js.vjs-remaining-time {
  display: none;
}
</style>
<style>

</style>
