<template>
  <div id="index">
    demo
    <router-link to="/demo/chart">
      图表示例
    </router-link>
    <router-link to="/demo/tpl">
      全生命周期模板
    </router-link>
    功能
    <router-link to="/chart_editor">
      图表编辑
    </router-link>
  </div>
</template>

<script>
export default {
  mounted() {
    var inputs = this.$el.getElementsByTagName('input');
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', true, true);
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].dispatchEvent(evt);
    }
  },
  data() {
    return {
      arr: [{ name: '1111ssssssssss1111111111111111111111' }]
    };
  },
  methods: {
    trigger() {
      var el = event.target;
      autoGrow(el);
    }
  }
};
function autoGrow(el) {
  if (el.scrollWidth > el.clientWidth) {
    el.style.width = el.scrollWidth + 'px';
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
