<template>
<div>
  <div id="player">

  </div>
</div>
</template>

<script>
import DPlayer from 'dplayer'

export default {
  name: "VideoPlayer",
  props:{
    url:""
  },
  data(){
    return{
  player:null
    }
  },
  methods:{
    init(){
      this.player=new DPlayer({
        container:document.getElementById("player"),
        hotkey:true,
        video:{
          url:this.url
        }
      })
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>

</style>