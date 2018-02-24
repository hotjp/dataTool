<template>
  <div class="title">
    <form onsubmit="return false">
      <el-collapse v-model="activeNames">
          <el-collapse-item title="图表标题" name="1">
            <el-input v-model="title.text" @input="titleText()" placeholder="请输入内容"></el-input>       
          </el-collapse-item>
      </el-collapse>
    </form>
  </div>
</template>
<script type="text/babel">
export default {
  data: () => ({
    // 标题，字号
    title: {
      text: '',
      textStyle:{
        fontSize:14
      }
    },
    // 默认配置项展开
    activeNames:['1']
  }),
  props: ['setTitle'],
  methods: {
    // 更新标题
    titleText() {
      this.$emit('titleText', this.title);
    }
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