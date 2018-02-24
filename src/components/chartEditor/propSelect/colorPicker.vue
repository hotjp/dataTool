<template>
  <el-color-picker v-model="pickerColor"></el-color-picker>
</template>
<script type="text/babel">
export default {
  data: () => ({
    // 颜色选择器颜色  
    pickerColor:''
  }),
  mounted() {
    let that = this;
    that.pickerColor = that.color;
  },
  props: ['color'],
  watch: {
    pickerColor: {
      handler: function (val, oldval) {
        this.$emit('update:color', val);
      },
      deep: true
    },
    color: {
      handler: function (val, oldval) {
        this.pickerColor = val;
      },
      deep: true
    }
  }
};
</script>
