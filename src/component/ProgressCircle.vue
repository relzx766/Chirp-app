<template>
  <canvas id="myCanvas" ref="progress" :height="height" :width="width"></canvas>
</template>

<script>
export default {
  name: "ProgressCircle",
  props: {
    width: String,
    height: String,
    colors: Array,
    lineWidth: {
      type: Number,
      default: 5,
    },
  },
  methods: {
    doDraw() {
      const canvas = this.$refs.progress;
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = this.lineWidth;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2 - this.lineWidth;
      const sparatorWidth = this.colors.length > 1 ? 0.98 : 1;
      for (let i = 0; i < this.colors.length; i++) {
        ctx.strokeStyle = this.colors[i];
        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            radius,
            (i / this.colors.length) * 360 * (Math.PI / 180),
            ((i + sparatorWidth) / this.colors.length) * 360 * (Math.PI / 180)
        );
        ctx.stroke();
        if (this.colors.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = "black";
          ctx.arc(
              centerX,
              centerY,
              radius,
              ((i + sparatorWidth) / this.colors.length) * 360 * (Math.PI / 180),
              ((i + 1) / this.colors.length) * 360 * (Math.PI / 180) // 略大于彩色弧线的结束角度
          );
          ctx.stroke();
        }
      }
    },
  },
  watch: {
    colors() {
      this.doDraw();
    },
  },
  mounted() {
    this.doDraw();
  },
};
</script>
<style scoped></style>
