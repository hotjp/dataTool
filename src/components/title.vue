<template>
  <div class="title">
    <p>标题:{{title.text}}</p>
    <el-input v-model="title.text" @input="titleText()" placeholder="请输入内容"></el-input>
  </div>
</template>
<script type="text/babel">
export default{
  data:()=>({
    title:{
      text:''
    }
  }),
  props:['setTitle'],
  methods:{
    titleText(){
      this.$emit('titleText',this.title);
    }
  },
  mounted(){
    let that=this;
    // 初始化页面数据
    Object.assign(that.title,that.setTitle);
    // console.log(this);
  }
};
</script>