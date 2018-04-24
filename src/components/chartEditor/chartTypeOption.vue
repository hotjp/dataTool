<template>
  <div>
    <chartBar v-if="type=='bar'" :option="option" :data="data" @getSeries="getOption"></chartBar>
    <chartLine v-else-if="type=='line'" :option="option" :data="data" @getSeries="getOption"></chartLine>
    <chartPie v-else-if="type=='pie'" :option="option" :data="data" @getSeries="getOption"></chartPie>
    <chartArea v-else-if="type=='area'" :option="option" :data="data" @getSeries="getOption"></chartArea>
    <chartStackbar v-else-if="type=='stackbar'" :option="option" :data="data" @getSeries="getOption"></chartStackbar>
    <chartFunnel v-else-if="type=='funnel'" :option="option" :data="data" @getSeries="getOption"></chartFunnel>
    <chartRosePie v-else-if="type=='rosePie'" :option="option" :data="data" @getSeries="getOption"></chartRosePie>
    <chartRadar v-else-if="type=='radar'" :option="option" :data="data" @getSeries="getOption"></chartRadar>
    <chartTreemap v-else-if="type=='treemap'" :option="option" :data="data" @getSeries="getOption"></chartTreemap>
    <chartWaterfall v-else-if="type=='waterfall'" :option="option" :data="data" @getSeries="getOption"></chartWaterfall>
    <chartGauge v-else-if="type=='gauge'" :option="option" :data="data" @getSeries="getOption"></chartGauge>
    <chartWordCloud v-else-if="type=='wordCloud'" :option="option" :data="data" @getSeries="getOption"></chartWordCloud>
    <chartPercentStackbar v-else-if="type=='percentStackbar'" :option="option" :data="data" @getSeries="getOption"></chartPercentStackbar>
  
  </div>
</template>

<script>
// 引入图表组件
import chartBar from '../chartsComponents/chart-bar.vue';
import chartLine from '../chartsComponents/chart-line.vue';
import chartPie from '../chartsComponents/chart-pie.vue';
import chartArea from '../chartsComponents/chart-area.vue';
import chartStackbar from '../chartsComponents/chart-stackbar.vue';
import chartFunnel from '../chartsComponents/chart-funnel.vue';
import chartRosePie from '../chartsComponents/chart-rosePie.vue';
import chartRadar from '../chartsComponents/chart-radar.vue';
import chartTreemap from '../chartsComponents/chart-treemap.vue';
import chartWaterfall from '../chartsComponents/chart-waterfall.vue';
import chartGauge from '../chartsComponents/chart-gauge.vue';
import chartWordCloud from '../chartsComponents/chart-wordCloud.vue';
import chartPercentStackbar from '../chartsComponents/chart-percentStackbar.vue';


export default {
  components: {
    chartBar, chartLine, chartPie, chartArea, chartStackbar, chartFunnel, 
    chartRosePie, chartRadar,chartTreemap,chartWaterfall,chartGauge,chartWordCloud,
    chartPercentStackbar
  },
  mounted() {
  },
  data:()=>({
      // series设置
      seriesOption: {
      },
      // 图表样式
      chartsStyle: {
        xAxis: {
          splitLine: {
            show: false,
            lineStyle: {
              color: ['#ccc'],
              width: 1,
              type: 'solid'
            }
          }
        },
        yAxis: {
          splitLine: {
            show: false,
            lineStyle: {
              color: ['#ccc'],
              width: 1,
              type: 'solid'
            }
          }
        }

      }
    }),
  watch: {
    chartsStyle: {
      handler: function (oldval, val) {
        this.$emit('submitOption', val);
      }
    }
  },
  methods: {
    getOption(data) {
      this.$emit('submitOption', data);
    },
    lineType(command) {
      this.chartsStyle.xAxis.splitLine.lineStyle.type = command;
    },
    lineWidth(command) {
      this.chartsStyle.xAxis.splitLine.lineStyle.width = command;
    }
  },
  props: ['option', 'data', 'type']  
};
</script>

<style scoped>
.split_line {
  font-size: 13px;
}
</style>
