<template>
<div id="indexHeader">
  <div class="fix" style="height:100%">
    <div class="r">
      <div class="header_right fix">
        <a href="javascript:;" class="fullscreen l" :class="{active:isFullscreen}" v-if="isFullscreen" @click="toggleFullScreen()">退出全屏</a>
        <a href="javascript:;" class="fullscreen l" v-else @click="toggleFullScreen()">全屏</a>
        <el-dropdown class="user_info l fix"  placement="bottom">
          <span class="el-dropdown-link">
            <img class="" :src="userImg" alt="">
            <span class="user_name">
              {{userName}}
            </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a href="javascript:;" @click="showinfo()">账户设置</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="javascript:;" @click="toggleChangePwd()">修改密码</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="javascript:;" @click="logout()">安全退出</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <a @click="onClickChangeTitleType(3)" href="javascript:;" :class="{head_title:true,r:true,active:(titleType == 3)}">数据源</a>
      <a @click="onClickChangeTitleType(2)" href="javascript:;" :class="{head_title:true,r:true,active:(titleType == 2)}">数据视图</a>    
      <a @click="onClickChangeTitleType(1)" href="javascript:;" :class="{head_title:true,r:true,active:(titleType == 1)}">仪表盘</a>
    </div>
    <!-- logo分段 -->
    <h1 href="javascript:;" class="logo1"></h1>
    <h1 href="javascript:;" class="logo2"></h1>
    <h1 href="javascript:;" class="logo3"></h1>
    <message></message>
  </div>
  <div>
    <imgUpload @showUpload="edit" @close='closeUpload' :show="showeditUpload"></imgUpload> 
    <userInfo @showUpload="edit" @close='closeInfo' @refreshHeadImg="refreshHeadImg" :show="showInfo" :uploadImg="uploadImg" ></userInfo>
    <el-dialog
      title="密码修改"
      :visible.sync="changePwdVisible"
      :append-to-body="true"
      :before-close="handleClose" class="common_dialog">
      <el-form :model="ruleForm" ref="ruleForm" status-icon :rules="rules" class="demo-ruleForm">
        <el-form-item label="" prop="pwd">
          <div class="title">旧密码</div>
          <el-input type="password" v-model="ruleForm.pwd"  auto-complete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="" prop="newPwd">
          <div class="title">新密码</div>
          <el-input type="password" v-model="ruleForm.newPwd" auto-complete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="" prop="renewPwd">
          <div class="title">再次输入新密码</div>
          <el-input type="password" v-model="ruleForm.renewPwd" auto-complete="off" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggleChangePwd()">取 消</el-button>
        <el-button type="primary" @click="changePwd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</div>
</template>
<script>
import { getJson } from '../router/utils';
import message from './message.vue';
import imgUpload from './common/imgUpload.vue';
import userInfo from './user/userInfo.vue';
export default {
  components: { message, imgUpload, userInfo },
  mounted() {
    var that = this;
    this.isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

    if (this.$route.path.indexOf('dataview') > 0) {
      this.titleType = 2;
    } else if (this.$route.path.indexOf('database') > 0) {
      this.titleType = 3;
    } else {
      this.titleType = 1;
    }

    getJson('/member/getSessionMember.do', {}, function (res) {
      if (res.success) {
        that.userImg = vars.root + '/upload/' + res.data.user.userPic;
        that.userName = res.data.user.userName;
      }
    });
    getJson('/common/getRegularExpression.do', {
      no: 'userPwd'
    }, function (res) {
      that.passReg = new RegExp(res.data.regularExpression[0].regexp);
    });
    function fullscreenchange() {
      var isFull = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      if (!isFull) {
        that.isFullscreen=isFull;
      }
    }
    document.addEventListener('fullscreenchange', fullscreenchange);
    document.addEventListener('mozfullscreenchange', fullscreenchange);
    document.addEventListener('webkitfullscreenchange', fullscreenchange);
    document.addEventListener('msfullscreenchange', fullscreenchange);
  },
  data() {
    var validatePass = (rule, value, callback) => {
      var that = this;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!that.passReg.test(value)) {
        callback(new Error('密码格式错误,请重新输入'));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      var that = this;
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (!that.passReg.test(value)) {
        callback(new Error('新密码格式错误,请重新输入'));
      } else if (value == that.ruleForm.pwd) {
        callback(new Error('新旧密码输入相同,请重新输入'));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      var that = this;
      if (value === '') {
        callback(new Error('请重复输入新密码'));
      } else if (!that.passReg.test(value)) {
        callback(new Error('新密码格式错误,请重新输入'));
      } else if (value != that.ruleForm.newPwd) {
        callback(new Error('两次输入新密码不一致,请重新输入'));
      } else {
        callback();
      }
    };
    return {
      // 页面控制
      // 当前页面
      titleType: 1,
      // 是否全屏
      isFullscreen: false,
      // 显示编辑图片
      showeditUpload: false,
      // 用户信息
      showInfo: false,
      changePwdVisible: false,
      // 用户头像，用户名
      userImg: '',
      userName: '',
      // 用户上传的头像
      uploadImg: '',
      passReg: /\S/,
      ruleForm: {
        pwd: '',
        newPwd: '',
        renewPwd: ''
      },
      rules: {
        pwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPwd: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        renewPwd: [
          { validator: validatePass3, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    closeInfo(e) {
      this.showInfo = e;
    },
    showinfo() {
      this.showInfo = true;
    },
    closeUpload(e) {
      this.uploadImg = e;
    },
    refreshHeadImg() {
      // base64 不需加vars.src
      this.userImg = this.uploadImg;
    },
    edit(e) {
      this.showeditUpload = e;
    },
    onClickChangeTitleType: function (type) {
      this.titleType = type;
      if (type == 1) {
        this.$router.push({ path: '/' });
      } else if (type == 2) {
        this.$router.push({ path: '/dataview' });
      } else if (type == 3) {
        this.$router.push({ path: '/database' });
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
              : '';
      }

    },
    handleClose() {
      this.toggleChangePwd();
    },
    toggleChangePwd() {
      this.changePwdVisible = !this.changePwdVisible;
    },
    // 修改密码
    changePwd() {
      let that = this;
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          getJson('/member/updateMemberPwd.do', {
            oldPwd: that.ruleForm.pwd,
            newPwd1: that.ruleForm.newPwd,
            newPwd2: that.ruleForm.renewPwd,
            account: that.userName
          }, function (res) {
            if (res.success) {
              that.$message({ message: '修改成功', type: 'success' });
              that.changePwdVisible = false;
              that.$router.push({ path: '/login' });
            } else {
              that.$message({ message: res.errorMessage || '系统错误', type: 'warning' });
            }
          });
        } else {
          return false;
        }
      });

    },
    // 退出登录
    logout() {
      let that = this;
      getJson('/member/deleteMemberInSession.do', {}, function (res) {
        if (res.success) {
          that.$router.push({ path: '/login' });
        } else {
          that.$message({ message: res.errorMessage || '系统错误', type: 'warning' });
        }
      });
    }

  },
  watch: {

  }
};
</script>
<style scoped>
#indexHeader .el-dropdown-menu__item,
.el-dropdown-menu__item a,
.el-dropdown-menu__item:not(.is-disabled):hover,
.el-dropdown-menu__item:not(.is-disabled):focus {
  color: #4da9ff;
}
.common_dialog {
  line-height: 1;
}
.common_dialog .title {
  color: #606266;
  font-size: 13px;
  line-height: 34px;
}
.el-form-item {
  margin-bottom: 6px;
}
.demo-ruleForm {
  height: 300px;
}
.demo-ruleForm>>>.el-form-item__error {
  left: auto;
  right: 0;
}
</style>

