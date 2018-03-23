<template>
  <el-main id="tpl">
    <input class="input" type="text" v-model="input">
  </el-main>
</template>

<script>
export default {
  components: {},
  beforeCreate() {
    // 组件创建前
  },
  created() {
    // 组件创建后
  },
  beforeMount() {
    // 挂载前
  },
  mounted() {
    // 挂载后
  },
  beforeUpdate() {
    // 数据更新前
  },
  updated() {
    // 数据更新后
  },
  beforeDestroy() {
    // 销毁前
  },
  destroyed() {
    // 销毁后
  },
  data: () => ({
    input: 'sssssssssssssssssssssssssss'
  }),
  computed: {

  },
  watch: {
  },
  methods: {
    // 方法，可用this.trigger直接调用
    trigger() { },
    updateSize() {
      var el = this.$el.getElementsByClassName('input')[0];
      if (el.scrollWidth > el.clientWidth) {
        el.style.width = el.scrollWidth + 'px';
      }
    }
  },
  props:[]
};
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
