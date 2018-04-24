<template>
  <form onsubmit="return false">
    <input v-model="title.text" @input="titleText()" placeholder="请输入内容"></input>       
  </form>
</template>
<script type="text/babel">
export default {
  data: () => ({
    // 标题，字号
    title: {
      text: '',
      textStyle:{
        fontSize:14,
        color:'#333'
      }
    },
    // 默认配置项展开
    activeNames:['1']
  }),
  watch:{
    setTitle: {
      handler: function(val, oldval) {
        // 发数据
        this.title=Object.assign({},this.title, val);
      },
      deep: true
    }
  },
  methods: {
    // 更新标题
    titleText() {
      this.$emit('titleText', this.title);
    }
  },
  props: ['setTitle']
  
};
</script>