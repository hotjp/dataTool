<template>
  <div id="message" :class="{active:showMessage}" >
    <!-- <transition name="slide-fade"> -->
      <div v-show="showMessage" class="message_box" v-loading="loadding">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户消息" name="user">
            <ul>
              <div v-if="!messageList.length" class="empty">暂无消息</div>
              <li v-for="(item,index ) in messageList" :key="index" :class="{unread:!item.read}" @click="onClickMessage(item.messId,index)">
                {{item.messContent}}
                <p class="time">{{item.sendTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</p>
              </li>
              <el-button v-if="messageList.length && showMoreBtn"  size="mini" @click="loadMessage">加载更多</el-button>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="平台消息" name="platform">
            <ul>
              <div v-if="!messageList.length" class="empty">暂无消息</div>
              <li v-for="(item,index ) in messageList" :key="index" :class="{unread:!item.read && activeName=='user'}" @click="onClickMessage(item.messId,index)">
                {{item.messContent}}
                <p class="time">{{item.sendTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</p>
              </li>
              <el-button v-if="messageList.length && showMoreBtn"  size="mini" @click="loadMessage">加载更多</el-button>
            </ul>
          </el-tab-pane>
          <!-- <el-tab-pane label="配置管理" name="second">配置管理1</el-tab-pane> -->
        </el-tabs>
        <a v-if="messageList.length && activeName=='user' && hasUnreadMsg " href="javascript:;" class="set_read" @click="setAllread">全部已读</a>
      </div>
    <!-- </transition> -->
    <i class="fa fa-info-circle" @click="toggleMessage"></i>
  </div>
</template>

<script>
import { getJson } from '../router/utils';
import { dateFormat } from '../router/utils';

export default {
  components: {},
  mounted() {
    // 挂载后
  },
  data: () => ({
    showMessage: false,
    activeName: 'user',
    page: 1,
    pageSize: 5,
    startFlag: null,
    messageList: [],
    // 会员：user;平台：platform
    type: 'user',
    loadding: false,
    // 是否显示加载更多按钮
    showMoreBtn: false,
    hasUnreadMsg:false
  }),
  methods: {
    handleClick(tab, event) {
      this.messageList = [];
      this.type = tab.paneName;
      this.page = 1;
      this.loadding = true;
      this.startFlag=null;
      this.loadMessage();
    },
    toggleMessage() {
      this.showMessage = !this.showMessage;
      if (this.showMessage) {
        this.type = this.activeName;
        this.loadding = true;
        this.refreshMessage();
      }
    },
    // 加载消息
    loadMessage() {
      var that = this;
      that.hasUnreadMsg=false;
      getJson('/message/doSearchMessageList.do', {
        page: that.page,
        pageSize: that.pageSize,
        startFlag: that.startFlag,
        type: that.type
      }, function (res) {
        if (res.success) {
          that.page++;
          that.messageList.push(...res.data.messageList.rows);
          that.startFlag = res.data.startFlag;
          that.loadding = false;
          if (res.data.messageList.pageCount < res.data.pageId) {
            that.showMoreBtn = true;
          } else {
            that.showMoreBtn = false;
          }
          for(let i=0;i<that.messageList.length;i++){
            if(!that.messageList[i].read){
              that.hasUnreadMsg=true;
            }
          }
        } else {
          that.$message({ message: res.errorMessage, type: 'warning' });
        }
      }
      );
    },
    // 刷新
    refreshMessage() {
      this.page = 1;
      this.startFlag = null;
      this.messageList.splice(0, this.messageList.length);
      this.loadMessage();
    },
    // 置为已读
    onClickMessage(id, index) {
      var that = this;
      that.hasUnreadMsg=false;
      getJson('/message/doUptMessageStatus.do', {
        messId: id
      }, function (res) {
        if (id) {
          that.messageList[index].read = true;
        } else {
          // 没有id为全部已读
          for (let i = 0; i < that.messageList.length; i++) {
            that.messageList[i].read = true;
          }
        }
        for(let i=0;i<that.messageList.length;i++){
          if(!that.messageList[i].read){
            that.hasUnreadMsg=true;
          }
        }
      });
    },
    // 全部已读
    setAllread() {
      this.onClickMessage(null);
    }
  },
  filters: {
    dateFormat
  }
};
</script>

