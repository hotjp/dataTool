<template>

<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <vueCropper
		ref="cropper3"
		:img="example3.img"
		:autoCrop="example3.autoCrop"
		:autoCropWidth="example3.autoCropWidth"
		:autoCropHeight="example3.autoCropHeight"
		:fixedBox="example3.fixedBox"
	></vueCropper>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
    dialogVisible: true,
    example3: {
      img: 'https://o90cnn3g2.qnssl.com/0C3ABE8D05322EAC3120DDB11F9D1F72.png',
      autoCrop: true,
      autoCropWidth: 200,
      autoCropHeight: 200,
      fixedBox: true
    }
  }),
  watch: {

  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
  props: []
};
</script>
