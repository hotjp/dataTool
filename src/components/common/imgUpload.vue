<template>
  <el-dialog
    title="图片上传"
    :visible.sync="dialogVisible"
    width="30%"
    :append-to-body="true"    
    :before-close="handleClose">
    <label class="btn" for="uploads">点击选择要上传的图片</label>
    <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
    <div class="upload_body">
      <vueCropper
        ref="cropper3"
        :img="example3.img"
        :autoCrop="example3.autoCrop"
        :autoCropWidth="example3.autoCropWidth"
        :autoCropHeight="example3.autoCropHeight"
        :fixedBox="example3.fixedBox"
        :canMoveBox="false"
      ></vueCropper>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog()">取 消</el-button>
      <el-button type="primary" @click="imgSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import VueCropper from 'vue-cropper';

export default {
  components:{VueCropper},
  mounted() {

  },
  data: () => ({
    dialogVisible: false,
    example3: {
      img: '',
      autoCrop: true,
      autoCropWidth: 200,
      autoCropHeight: 200,
      fixedBox: true
    }
  }),
  watch: {
    show:function(val, oldVal){
      this.dialogVisible=val;
    },
    dialogVisible:function(val, oldVal){
      this.$emit('showUpload',this.dialogVisible);
    }
  },
  methods: {
    dialog(){
      this.dialogVisible=false;
    },
    imgSubmit(){
      // var test = window.open('about:blank');
      // test.document.body.innerHTML = '图片生成中..';
      this.$refs.cropper3.getCropData((data) => {
        if(data){
          this.$emit('close',data);
          this.dialogVisible=false;
        }
        
      });

    },
    handleClose(done) {
      this.dialogVisible=false;
    },
    uploadImg(e,num){
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
				 alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
				 return false;
			 }
      var reader = new FileReader();
      reader.onload = (e) => {
        let data;
        data = e.target.result;
        if (num === 1) {
          this.example3.img = data;
        } else if (num === 2) {
          this.example3.img = data;
        }
      };
      reader.readAsDataURL(file);
    }
  },
  props: ['show']
};
</script>
<style scoped>
.upload_body{
  height:300px;
}
.vue-cropper{
  width:335px;
  height:300px; 
  margin: 0 auto;
  background:rgba(0,0,0,0.2);
}

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
.el-dialog__wrapper >>> .el-dialog__footer{
  margin-top: 10px;
}
.btn{
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:rgba(25,137,250,1);
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
.cropper-view-box{
  outline: 1px solid #1989FA;
  outline-color: #1989FA;
}
</style>
