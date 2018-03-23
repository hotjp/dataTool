<template>
<el-collapse  v-model="activeNames" id="">
  <el-collapse-item title="图表背景" name="1">
    背景颜色：
    <colorPicker class="color_picker" :color.sync="backgroundStyle.backgroundColor" ></colorPicker>

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
    activeNames:'1'
  }),
  watch: {
    
    backgroundStyle: {
      // 父级传来的图表数据
      handler: function(newVal, oldVal) {
        if(!newVal.backgroundColor){
          newVal.backgroundColor = 'transparent'
        }
        this.$emit('backgroundOption', newVal);
      },
      deep: true
    }
  },
  methods: {
    
  },
  props: ["backgroundStyle"]
};
</script>
<style scoped>
.color_picker{
  vertical-align: middle;
}
</style>
