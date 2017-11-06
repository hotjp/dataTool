<template>
  <div id="tpl">
      <input class="input" type="text" v-model="input">
  </div>
</template>

<script>
export default {
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
  data() {
    // 组件数据
    return {
      input: 'sssssssssssssssssssssssssss'
    };
  },
  watch: {
    input: function(val) {
      this.updateSize();
    }
  },
  methods: {
    // 方法，可用this.trigger直接调用
    trigger() {
    },
    updateSize() {
      var el = this.$el.getElementsByClassName("input")[0];
      if (el.scrollWidth > el.clientWidth) {
        el.style.width = el.scrollWidth + "px";
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
