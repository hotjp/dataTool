<template>
  <div id="login" class="login_body">
    <div class="login_b fix">
      <div class="l left">
        <img src="../../assets/images/login_left.jpg" alt="">
      </div>
      <div class="l right">
        <div v-show="login">
          <el-menu active-text-color="#3582e3" :default-active="loginIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">帐号登录</el-menu-item>
            <!-- <el-menu-item index="2">短信登陆</el-menu-item> -->
          </el-menu>
          <div v-show="loginActive">
            <form action onsubmit="return false">
              <div class="login_ipt">
                <input type="text" v-model="login_name" placeholder="手机号/用户名" autocomplete="off">
              </div>
              <div class="login_ipt">
                <input v-if="passwordHide" type="password" v-model="login_pwd" placeholder="密码" autocomplete="off">
                <input v-else type="text" v-model="login_pwd" placeholder="密码" autocomplete="off">
                <i class="fa" :class="{on:!passwordHide,'fa-eye':!passwordHide,'fa-eye-slash':passwordHide}" @mousedown="passwordHide=false" @mouseup="passwordHide=true"></i>
              </div>
              <div class="login_error">{{loginMessage}}</div>
              <div class="login_btn"><button @click="gpLogin()" class="btn_go">登录</button></div>
            </form>
            <div class="login_tip fix">
              <div class="l">还没有帐号?<span @click="regTag()" class="reg">免费注册</span></div>
              <div class="r forget"  @click="forgetPassword()">忘记密码?</div>
            </div>
          </div>
          <div v-show="!loginActive">
            <form action onsubmit="return false">
              <div class="login_ipt"><input type="text" placeholder="手机号" autocomplete="off"></div>
              <div class="login_ipt">
                <input type="text" placeholder="短信验证码" autocomplete="off">
                <div class="sent">获取验证码</div>
              </div>
              <div class="login_btn"><button>登录</button></div>
            </form>
            <div class="login_tip fix">
              <div class="l">还没有帐号?<span @click="regTag()" class="reg">免费注册</span></div>
              <div class="r forget" @click="forgetPassword()">忘记密码?</div>
            </div>
          </div>
        </div>
        <div v-show="forgetPass">
          <el-menu active-text-color="#3582e3" :default-active="refindIndex" class="el-menu-demo" mode="horizontal" @select="refindSelect">
            <el-menu-item index="1">邮箱找回</el-menu-item>
            <el-menu-item index="2">手机找回</el-menu-item>
          </el-menu>
          <div v-show="refindActive">
            <form action onsubmit="return false">
              <div class="login_ipt"><input type="text" placeholder="邮箱" autocomplete="off"></div>
              <div class="login_ipt">
                <input type="text" placeholder="验证码" autocomplete="off">
                <div class="sent">获取验证码</div>
                </div>
              <div class="login_btn"><button>确定</button></div>
            </form>
            <div class="login_tip fix">
              <div class="l">还没有帐号?<span @click="regTag()" class="reg">免费注册</span></div>
              <div class="r forget" @click="goLogin()">立即登录</div>
            </div>
          </div>
          <div v-show="!refindActive">
            <form action onsubmit="return false">
              <div class="login_ipt"><input type="text" placeholder="手机号" autocomplete="off"></div>
              <div class="login_ipt">
                <input type="text" placeholder="短信验证码" autocomplete="off">
                <div class="sent">获取验证码</div>
              </div>
              <div class="login_btn"><button>确定</button></div>
            </form>
            <div class="login_tip fix">
              <div class="l">还没有帐号?<span @click="regTag()" class="reg">免费注册</span></div>
              <div class="r forget" @click="goLogin()">立即登录</div>
            </div>
          </div>
        </div>
        <div class="reg" v-show="reg">
          <el-menu active-text-color="#3582e3" :default-active="refindIndex" class="el-menu-demo" mode="horizontal" @select="refindSelect">
            <!-- <el-menu-item index="1">邮箱注册</el-menu-item> -->
            <el-menu-item index="1">帐号注册</el-menu-item>
          </el-menu>
          <div v-show="refindActive">
            <form action onsubmit="return false">
              <div class="login_ipt"><input type="text" placeholder="邮箱" autocomplete="off"></div>
              <div class="login_ipt">
                <input type="text" placeholder="验证码" autocomplete="off">
                <div class="sent">获取验证码</div>
                </div>
              <div class="login_ipt"><input type="password" placeholder="设置密码" autocomplete="off"></div>
              <div class="login_ipt"><input type="password" placeholder="再次输入密码" autocomplete="off"></div>
              <div class="login_btn"><button>确定</button></div>
            </form>
            <div class="login_tip fix">
              <!-- <div class="l">还没有帐号?<span class="reg">免费注册</span></div> -->
              <div class="r forget" @click="goLogin()">立即登录</div>
            </div>
          </div>
          <div v-show="!refindActive">
            <form action onsubmit="return false">
              <div class="login_ipt">
                <el-tooltip class="item" effect="light" :content="userNameTitle" placement="left">
                  <input type="text" v-model="userName"  placeholder="用户名" autocomplete="off">
                </el-tooltip>
                <i class="el-icon-success" :class="nameReg.test(userName)?'on':''"></i>
              </div>
              <div class="login_ipt">
                <el-tooltip class="item" effect="light" :content="telRegTitle" placement="left">
                  <input type="text" v-model="userTel" placeholder="手机号" autocomplete="off">
                </el-tooltip>
                <i class="el-icon-success" :class="telReg.test(userTel)?'on':''"></i>
              </div>
              <div class="login_ipt">
                <input type="text" v-model="code" placeholder="图形验证码" autocomplete="off">
                <div class="sent"><img :src='regcodeSrc' alt=""></div>
              </div>
              <div class="login_ipt">
                <el-tooltip class="item" effect="light" :content="pwdRegTitle" placement="left">
                  <input type="password" v-model="userPwd" placeholder="设置密码" autocomplete="off">
                </el-tooltip>
                <i class="el-icon-success" :class="pwdReg.test(userPwd)?'on':''"></i>
              </div>
              <div class="login_ipt">
                <input type="password" v-model="userPwd2" :title="pwdRegTitle" placeholder="再次输入密码" autocomplete="off">
                <i class="el-icon-success" :class="userPwd2==userPwd && pwdReg.test(userPwd)?'on':''"></i>
              </div>
              <div class="login_error">{{errorMessage}}</div>
              <div class="login_btn" @click="goReg()"><button>确定</button></div>
            </form>
            <div class="login_tip fix">
              <!-- <div class="l">还没有帐号?<span class="reg">免费注册</span></div> -->
              <div class="r forget" @click="goLogin()">立即登录</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getJson } from '../../router/utils';
export default {
  data: () => ({
    loginIndex: '1',
    loginIndex2: '1',
    loginActive:1,
    refindIndex: '1',
    refindIndex2: '1',
    refindActive:0,
    forgetPass:0,
    login:0,
    reg:1,
    regcodeSrc:'',
    userNameTitle:'',
    telRegTitle:'',
    pwdRegTitle:'',
    nameReg:/\S/,
    telReg:/\S/,
    pwdReg:/\S/,
    userName:'',
    userTel:'',
    userPwd:'',
    userPwd2:'',
    errorMessage:'',
    code:'',
    login_name:'',
    login_pwd:'',
    loginMessage:'',
    // 登录密码明密文控制
    passwordHide:true,
    regFlag:1
  }),
  mounted(){
    let that=this;
    that.regcodeSrc=vars.root+'/images/kaptcha.jpg?origin='+location.origin;
    // 获取正则表达式
    getJson('/common/getRegularExpression.do',{
      no:'userName,userTel,userPwd'
    },function(res){
      if(res.success){
        that.nameReg=new RegExp(res.data.regularExpression[0].regexp);
        that.telReg=new RegExp(res.data.regularExpression[1].regexp);
        that.pwdReg=new RegExp(res.data.regularExpression[2].regexp);
        that.userNameTitle=res.data.regularExpression[0].regDesc;
        that.telRegTitle=res.data.regularExpression[1].regDesc;
        that.pwdRegTitle=res.data.regularExpression[2].regDesc;
      }else{
        that.$message({ message: res.errorMessage || '系统错误', type: 'warning' });
        
      }
    });
  },
  methods: {
    // 切换登录块
    handleSelect(key, keyPath){
      // this.loginActive=!this.loginActive;
    },
    // 切换找回
    refindSelect(){
      // this.refindActive=!this.refindActive;
    },
    // 去登录
    goLogin(){
      // this.login=1;
      // this.forgetPass=0;
      // this.reg=0;
      this.$router.push({path:'/login'});
    },
    // 忘记密码
    forgetPassword(){
      this.login=0;
      this.forgetPass=1;
      this.reg=0;
    },
    // 注册帐号
    regTag(){
      this.login=0;
      this.forgetPass=0;
      this.reg=1; 
    },
    goReg(){
      let that=this;
      if(!that.regFlag){
        return;
      }
      if(that.userName==''||that.userTel==''||that.userPwd==''||that.userPwd2==''||that.code==''){
        return;
      }
      getJson('/member/memberRegister.do',{
        userName:that.userName,
        userTel:that.userTel,
        pwd1:that.userPwd,
        pwd2:that.userPwd2,
        code:that.code
      },function(res){
        if(res.success){
          that.$message({
            showClose: true,
            message: '恭喜你，注册成功',
            type: 'success'
          });
          setTimeout(function(){
            that.$router.push({path:'/login'});
          },1000);
        }else{
          that.errorMessage=res.errorMessage;
          that.regFlag=1;
        }
      });
    },
    gpLogin(){
      let that=this;
      getJson('/member/memberLogin.do',{
        account:that.login_name,
        pwd:that.login_pwd
      },function(res){
        if(res.success){
          that.$router.push({path:'/'});
        }else{
          that.loginMessage=res.errorMessage;
        }
      });
    },
    togglePassword(){
      this.passwordHide=!this.passwordHide;
    }
  }
};
</script>