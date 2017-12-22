<template>
  <div class="title">
    <el-collapse v-model="activeNames">
        <el-collapse-item title="图表标题" name="1">
          <el-input v-model="title.text" @input="titleText()" placeholder="请输入内容"></el-input>       
        </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script type="text/babel">
export default {
  data: () => ({
    title: {
      text: ''
    },
    activeNames:['1']
  }),
  props: ['setTitle'],
  methods: {
    titleText() {
      this.$emit('titleText', this.title);
    }
  },
  mounted() {
    let that = this;
    // 初始化页面数据

  },
  watch:{
    setTitle: {
      handler: function(val, oldval) {
        // 发数据
        Object.assign(this.title, val);
      },
      deep: true
    }
  }
};
</script>
<style scoped>

</style>
