<template>
  <div id="login" class="login_body">
    <div class="login_b fix">
      <div class="l left">
        <img src="../../assets/images/login_left.jpg" alt="">
      </div>
      <div class="l right">
        <div v-show="login">
          <el-menu active-text-color="#3582e3" :default-active="loginIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">登录</el-menu-item>
            <el-menu-item index="2">短信登陆</el-menu-item>
          </el-menu>
          <div v-show="loginActive">
            <form action onsubmit="return false">
              <div class="login_ipt"><input type="text" placeholder="手机号/邮箱"></div>
              <div class="login_ipt"><input type="text" placeholder="密码"></div>
              <div class="login_btn"><button>登录</button></div>
            </form>
            <div class="login_tip fix">
              <div class="l">还没有帐号?<span @click="regTag()" class="reg">免费注册</span></div>
              <div class="r forget"  @click="forgetPassword()">忘记密码?</div>
            </div>
          </div>
          <div v-show="!loginActive">
            <form action onsubmit="return false">
              <div class="login_ipt"><input type="text" placeholder="手机号"></div>
              <div class="login_ipt">
                <input type="text" placeholder="短信验证码">
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
              <div class="login_ipt"><input type="text" placeholder="邮箱"></div>
              <div class="login_ipt">
                <input type="text" placeholder="验证码">
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
              <div class="login_ipt"><input type="text" placeholder="手机号"></div>
              <div class="login_ipt">
                <input type="text" placeholder="短信验证码">
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
            <el-menu-item index="1">邮箱注册</el-menu-item>
            <el-menu-item index="2">手机注册</el-menu-item>
          </el-menu>
          <div v-show="refindActive">
            <form action onsubmit="return false">
              <div class="login_ipt"><input type="text" placeholder="邮箱"></div>
              <div class="login_ipt">
                <input type="text" placeholder="验证码">
                <div class="sent">获取验证码</div>
                </div>
              <div class="login_ipt"><input type="text" placeholder="设置密码"></div>
              <div class="login_ipt"><input type="text" placeholder="再次输入密码"></div>
              <div class="login_btn"><button>确定</button></div>
            </form>
            <div class="login_tip fix">
              <!-- <div class="l">还没有帐号?<span class="reg">免费注册</span></div> -->
              <div class="r forget" @click="goLogin()">立即登录</div>
            </div>
          </div>
          <div v-show="!refindActive">
            <form action onsubmit="return false">
              <div class="login_ipt"><input type="text" placeholder="手机号"></div>
              <div class="login_ipt">
                <input type="text" placeholder="短信验证码">
                <div class="sent">获取验证码</div>
              </div>
              <div class="login_ipt"><input type="text" placeholder="设置密码"></div>
              <div class="login_ipt"><input type="text" placeholder="再次输入密码"></div>
              <div class="login_btn"><button>确定</button></div>
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
    refindActive:1,
    forgetPass:0,
    login:1,
    reg:0
  }),
  methods: {
    // 切换登录块
    handleSelect(key, keyPath){
      this.loginActive=!this.loginActive;
    },
    // 切换找回
    refindSelect(){
      this.refindActive=!this.refindActive;
    },
    // 去登录
    goLogin(){
      this.login=1;
      this.forgetPass=0;
      this.reg=0;
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
    }
  }
};
</script>