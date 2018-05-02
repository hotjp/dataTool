<template>
  <div id="message" :class="{active:showMessage}">
    <transition name="slide-fade">
      <div v-show="showMessage" class="message_box">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">
            <ul>
              <li class="unread">
                1<br>11<br<br>>11<br>11<br>1
              </li>
              <li>
                1 <br> 11<br>1<br>111<br>1
              </li>
              <el-button size="mini" @click="loadMore">加载更多</el-button>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">配置管理1</el-tab-pane>
          <el-tab-pane label="角色管理" name="third">角色管理1</el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿1</el-tab-pane>
        </el-tabs>
        <a href="javascript:;" class="set_read">全部已读</a>
      </div>
    </transition>
    <i class="el-icon-loading"></i>
    <i class="fa fa-info-circle" @click="toggleMessage"></i>
  </div>
</template>

<script>
export default {
  components: {},
  mounted() {
    // 挂载后
  },

  data: () => ({
    showMessage:false,
    activeName: "first"
  }),
  computed: {},
  watch: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    toggleMessage(){
      this.showMessage=!this.showMessage
    },
    // 加载更多
    loadMore(){

    }
  },
  props: []
};
</script>

