<template>
  <el-dialog
    title="个人信息"
    :visible.sync="dialogVisible"
    width="30%"
    :append-to-body="true"
    :before-close="handleClose">
    <div class="login_massage">您已注册<span>{{date}}</span>天，登录<span>{{loginTimes}}</span>次，<span>have a nice day~!</span></div>
    <div class="fix img_message">
      <div class="l user_img_title">用户头像</div>
      <div class="r user_img" @click="editImg()"><img :src="img" alt=""></div>
    </div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="" prop="name">
        <div class="title">用户名</div>
        <el-input type="text" :disabled="true" v-model="ruleForm.name" auto-complete="off" placeholder="用户名称只展示不提交"></el-input>
      </el-form-item>
      <el-form-item label="" prop="mail">
        <div class="title">邮箱</div>
        <el-input type="text" v-model="ruleForm.mail"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getJson} from '../../router/utils';
export default {
  mounted() {
    var that=this;
    getJson('/common/getRegularExpression.do',{
      no:'userName,userEmail,userPwd'
    },function(res){
      that.nameReg=new RegExp(res.data.regularExpression[0].regexp);
      that.passReg=new RegExp(res.data.regularExpression[1].regexp);
      that.mailReg=new RegExp(res.data.regularExpression[2].regexp);
    });
    getJson('/member/getSessionMember.do',{},function(res){
      if(res.success){
        that.loginTimes=res.data.user.loginTimes;
        that.date=Math.floor((new Date().getTime()-new Date(res.data.user.regTime).getTime())/(24*3600*1000));
        that.img=vars.root+'/upload/'+res.data.user.userPic;
        that.ruleForm.name=res.data.user.userName;
        that.ruleForm.mail=res.data.user.userEmail;
        that.userId = res.data.user.userId;
      }
    });
    
  },
  data() {
    var that=this;
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if(!that.nameReg.test(value)){
        callback(new Error('用户名格式错误,请重新输入'));
      }else{
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'));
      } else if (!that.mailReg.test(value)) {
        callback(new Error('邮箱格式错误,请重新输入'));
      } else {
        callback();
      }
    };
    return{
      dialogVisible:false,
      loginTimes:0,
      date:'',
      img:'',
      nameReg:/\S/,
      passReg:/\S/,
      mailReg:/\S/,
      ruleForm: {
        name: '',
        mail: ''
      },
      rules: {
        name: [
          { validator: validatePass, trigger: 'blur' }
        ],
        mail: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      userId:''

    };
  },
  watch: {
    show:function(v,o){
      this.dialogVisible=v;
    },
    uploadImg:function(v,o){
      this.img=v;
    }
  },
  methods: {
    dialog(){
      this.dialogVisible=false;
      this.$emit('close',false);
    },
    handleClose(done) {
      this.dialog();
    },
    editImg(){
      this.$emit('showUpload',true);
    },
    // 用户信息提交
    submit(){
      var that = this;
      getJson('/member/updateMemberInfo.do',{
        userId:that.userId,
        headImg:that.uploadImg,
        email:that.ruleForm.mail
      },function(res){
        if(res.success){
          that.$message({ message: '保存成功', type: 'success' });
          that.$emit('close',false);
          if(that.uploadImg){
            that.$emit('refreshHeadImg',true);
          }
        }else{
          that.$message({ message: res.errorMessage||'系统错误', type: 'warning' });          
        }
      });
    }
  },
  props: ['show','uploadImg']
};
</script>
<style scoped>

.el-dialog__wrapper >>> .el-dialog__title{
  font-size:14px;
  font-family:PingFangSC-Regular;
  color:rgba(96,98,102,1);
  line-height:20px;
}
.el-dialog__wrapper >>> .el-dialog{
  width:360px !important;
  height:430px;
}

.el-dialog__wrapper >>> .el-button{
  padding:0;
  width:64px;
  height:32px;
  line-height: 32px;
  text-align: center;
}
.el-dialog__wrapper >>> .el-dialog .dialog-footer{
  padding:0;
}
.el-form >>> .el-form-item__content{
  margin-left: 0 !important;
}
.el-form .title{
  margin-bottom: 8px;
  font-size:13px;
  font-family:PingFangSC-Regular;
  color:rgba(96,98,102,1);
  line-height:18px;
}
.user_img_title{
  margin-top: 25px;
  font-size:13px;
  font-family:PingFangSC-Regular;
  color:rgba(96,98,102,1);
  line-height:18px;
}
.user_img{
  width:66px;
  height:66px;
}
.user_img img{
  display: block;
  width:100%;
  height:100%;
  border-radius: 50px;
  background: url(../../assets/images/user_head.png) center no-repeat;
  background-size: cover;
}
.login_massage{
  font-size: 12px;
  color:#909399;
  font-family: PingFangSC;
}
.login_massage span{
  color:#1989FA;
}
.img_message{
  margin:25px 0;
}
.demo-ruleForm >>> .el-form-item__error{
  right: 0;
  left:auto;
}
</style>
