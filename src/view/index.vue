<template>
  <div id="index">
    <!-- demo
    <router-link to="/demo/chart">
      图表示例
    </router-link>
    <router-link to="/demo/tpl">
      全生命周期模板
    </router-link>
    功能 -->
    <router-link to="/chart_editor/4ac8edaed4394980ad80beb82cc237af">
      图表编辑
    </router-link>
    <router-link to="/database">
      数据源列表
    </router-link>
    <router-link to="/database/add">
      增加数据源
    </router-link>
    <router-link to="/dashboard/ed3f29d5db1b4cee8d6a23a83587874c">
      仪表盘
    </router-link>
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
      database: [
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
.database {
  fill: #fff;
  stroke: #333;
  stroke-width: 1px;
}
.database:hover {
  stroke: #ffcc00;
  stroke-width: 3px;
} */
</style>
