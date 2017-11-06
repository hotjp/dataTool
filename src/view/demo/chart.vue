<template>
  <div class="echarts">
    <IEcharts :resizable="resizable" :option="bar" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
    <button @click="doRandom">Random</button>
  </div>
</template>

<script type="text/babel">
  import IEcharts from 'vue-echarts-v3/src/full.vue';
  import ChartUtil from '../../vendor/chart_util'
  var chartData  = ChartUtil.extendOption({
        title: {
          text: 'ECharts Hello World'
        },
        tooltip: {},
        xAxis: {
          data: ['Shirt', 'Sweater', 'Chiffon Shirt', 'Pants', 'High Heels', 'Socks']
        },
        yAxis: {},
        series: [{
          name: 'Sales',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        },
        {
          name: 'Sales1',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
  export default {
    name: 'view',
    components: {
      IEcharts
    },
    props: {
    },
    data: () => ({
      loading: true,
      resizable: true,
      bar: chartData
    }),
    methods: {
      doRandom() {
        const that = this;
        that.loading = !that.loading;        
        let data = [];
        for (let i = 0, min = 5, max = 99; i < 6; i++) {
          data.push(Math.floor(Math.random() * (max + 1 - min) + min));
        }
        that.loading = !that.loading;
        that.bar.series[0].data = data;
      },
      onReady(instance) {
        const that = this;
        that.loading = !that.loading;    
        console.log(instance);
      },
      onClick(event, instance, echarts) {
        // console.log(arguments);
      }
    }
  };
</script>

<style scoped>
  .echarts {
    width: 400px;
    height: 400px;
  }
</style>