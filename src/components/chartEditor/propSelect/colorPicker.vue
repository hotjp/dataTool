<template>
  <el-color-picker v-model="pickerColor"></el-color-picker>
</template>
<script type="text/babel">
export default {
  mounted() {
    let that = this;
    that.pickerColor = that.color;
  },
  data: () => ({
    // 颜色选择器颜色  
    pickerColor:''
  }),
  watch: {
    pickerColor: {
      handler: function (val, oldval) {
        if(!val){
          val = 'transparent'
        }
        this.$emit('update:color', val);
      },
      deep: true
    },
    color: {
      handler: function (val, oldval) {
        if(val == 'transparent'){
          val = null
        }
        this.pickerColor = val;
      },
      deep: true
    }
  },
  props: ['color']
  
};
</script>
