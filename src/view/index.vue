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
    <router-link to="/chart_editor/1">
      图表编辑1
    </router-link>
    <router-link to="/chart_editor/2">
      图表编辑2
    </router-link>
    <router-link to="/chart_editor">
      图表编辑
    </router-link>
    <router-link to="/datebase">
      数据源列表
    </router-link>
    <router-link to="/datebase/add">
      增加数据源
    </router-link>
    <div id="graphContainer">

    </div>
  </div>

</template>
<script>
// require('../assets/js/mxClient');

export default {
  mounted() {
    window.vm = this;
  },
  data() {
    return {
      databaseView: {
        isMouseDown: false,
        target: null,
        startPosition: {
          x: 0,
          y: 0
        }
      },
      datebase: [
        {
          name: '1',
          x: 0,
          y: 0,
          children: [
            { name: 'ch1' },
            { name: 'ch1' },
            { name: 'ch1' },
            { name: 'ch1' }
          ]
        },
        {
          name: '2',
          x: 0,
          y: 0,
          children: [
            { name: 'ch1' },
            { name: 'ch2' },
            { name: 'ch3' },
            { name: 'ch4' },
            { name: 'ch5' },
            { name: 'ch3' },
            { name: 'ch4' },
            { name: 'ch5' }
          ]
        },
        {
          name: '3',
          children: [
            { name: 'ch1' },
            { name: 'ch2' }
          ]
        }
      ]
    };
  },
  methods: {
    init() {
      // main(document.getElementById('graphContainer'));
    },
    renderDatabase() {

    }

  }
};

</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
/* #svg {
  width: 100%;
  height: 500px;
}
.datebase {
  fill: #fff;
  stroke: #333;
  stroke-width: 1px;
}
.datebase:hover {
  stroke: #ffcc00;
  stroke-width: 3px;
} */
</style>
