<template>
<el-collapse  v-model="activeNames" id="">
  <el-collapse-item title="图表背景" name="1">
    <div class="fix">
      背景颜色：
      <colorPicker class="color_picker" :color.sync="backgroundStyle.backgroundColor" ></colorPicker>
    </div>
    <div class="fix" style="display:none;"> 
      背景图片：
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        accept=".jpg,.png,.jpeg"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <button type="button" class="del_btn" v-if="imageUrl" @click="delUpload">删除</button>
    </div>            
    
  </el-collapse-item>
</el-collapse>
</template>

<script>
import colorPicker from "../chartEditor/propSelect/colorPicker.vue";

export default {
  components: {
    colorPicker
  },
  mounted() {
    let that = this;
  },
  data: () => ({
    activeNames: "1",
    imageUrl: ""
  }),
  watch: {
    backgroundStyle: {
      // 父级传来的图表数据
      handler: function(newVal, oldVal) {
        if (!newVal.backgroundColor) {
          newVal.backgroundColor = "transparent";
        }
        this.$emit("backgroundOption", newVal);
      },
      deep: true
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
      return true
    },
    delUpload(){
      this.imageUrl=''
    }
  },
  props: ["backgroundStyle"]
};
</script>
<style >
.color_picker {
  vertical-align: middle;
}
.avatar-uploader{
  margin-top: 10px;
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 128px;
  line-height: 128px;
}
.avatar-uploader .el-upload:hover {
  border-color: #4da9ff;
}
.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.avatar {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
.del_btn{
  cursor: pointer;
  display: block;
  margin: 0 auto;
  border: none;
  background-color: transparent;
  color: #4da9ff;
  outline: none;
}
</style>
