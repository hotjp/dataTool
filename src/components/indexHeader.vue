<template>
  <div id="indexHeader" class="fix">
    <h1 href="javascript:;" class="logo"></h1>
    <div class="header_right r fix">
      <a href="javascript:;" class="fullscreen l" :class="{active:isFullscreen}" v-if="isFullscreen" @click="toggleFullScreen()">退出全屏</a>
      <a href="javascript:;" class="fullscreen l" v-else @click="toggleFullScreen()">全屏</a>
      <el-dropdown class="user_info l fix"  placement="bottom-start">
        <span class="el-dropdown-link">
          <img class="l" src="http://temp.im/30x30" alt="">
        <span class="user_name l">
          用户名
        </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="">账户设置</router-link>
            </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/login">安全退出</router-link>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <a @click="onClickChangeTitleType(3)" href="javascript:;" :class="{head_title:true,r:true,active:(titleType == 3)}">数据源</a>
    <a @click="onClickChangeTitleType(2)" href="javascript:;" :class="{head_title:true,r:true,active:(titleType == 2)}">数据视图</a>    
    <a @click="onClickChangeTitleType(1)" href="javascript:;" :class="{head_title:true,r:true,active:(titleType == 1)}">仪表盘</a>
  </div>
</template>
<script>
import vars from "../assets/js/vars";

export default {
  mounted() {
    this.isFullscreen =
      document.documentElement.fullScreen ||
      document.documentElement.mozFullScreen ||
      document.documentElement.webkitIsFullScreen;
      if(this.$route.path.indexOf('dataview')>0){
        this.titleType = 2
      }else if(this.$route.path.indexOf('database')>0){
        this.titleType = 3
      }else{
        this.titleType = 1        
      }
  },
  data: () => ({
    titleType: 1,
    isFullscreen: false
  }),
  methods: {
    onClickChangeTitleType: function(type) {
      this.titleType = type;
      if (type == 1) {
        this.$router.push({ path: "/" });
      } else if (type == 2) {
        this.$router.push({ path: "/dataview" });
      } else if (type == 3) {
        this.$router.push({ path: "/database" });
      }
    },
    toggleFullScreen() {
      let that = this,
        el = document.documentElement;
      that.isFullscreen = !that.isFullscreen;
      if (that.isFullscreen) {
        //进入全屏,多重短路表达式
        (el.requestFullscreen && el.requestFullscreen()) ||
          (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
          (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
          (el.msRequestFullscreen && el.msRequestFullscreen());
      } else {
        //退出全屏,三目运算符
        document.exitFullscreen
          ? document.exitFullscreen()
          : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.webkitExitFullscreen
              ? document.webkitExitFullscreen()
              : "";
      }
    }
  }
};
</script>
<style scoped>
.el-dropdown-menu__item,
.el-dropdown-menu__item a,
.el-dropdown-menu__item:not(.is-disabled):hover,
.el-dropdown-menu__item:not(.is-disabled):focus {
  color: #4da9ff;
}
</style>

