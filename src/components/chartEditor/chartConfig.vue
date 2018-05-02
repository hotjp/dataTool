<template>
  <div class="chartConfig">
    <chartXaxis v-if="charts.type!='table'" class="series" @xaxisOptions="getOptions" :setXaxis="option.xAxis"></chartXaxis>
    <chartYaxis v-if="charts.type!='table'" class="series" @yaxisOptions="getOptions" :setYaxis="option.yAxis"></chartYaxis>
    <chartLegend v-if="charts.type!='table'" class="series" @legendOptions="getOptions" :propData="setProp" :setLegend="option.legend" :chartsType="charts.type"></chartLegend>
    <background class="series" :backgroundStyle="charts.background" @backgroundOption="backgroundOption"></background>
    <chartTypeOption class="series" :option="option" :data="setProp" :type="charts.type" @submitOption="submitOption"></chartTypeOption>
  </div>
</template>
<script type="text/babel">
// 默认配置
import defaultData from '../../vendor/defaultOption.json';
// 相关组件
import chartXaxis from './xaxis.vue';
import chartYaxis from './yaxis.vue';
import chartLegend from './legend.vue';
import chartTypeOption from './chartTypeOption.vue';
import background from './background.vue';

export default {
  components: {
    chartXaxis,
    chartYaxis,
    chartLegend,
    chartTypeOption,
    background
  },
  beforeMount() {
    Object.assign(this.option, defaultData.option, this.charts.option);
  },
  data: () => ({
    option: {
    },
    graphData: {}
  }),
  watch: {
    option: {
      handler: function (val, oldval) {
        // 发数据
        this.$emit('getProp', val);
      },
      deep: true
    },
    'charts.type': {
      handler: function (val, oldval) {
        this.option = Object.assign({}, this.option, defaultData.option, this.charts.option);
      },
      deep: true
    }
  },
  methods: {
    // 获取图表配置
    getOptions: function (data) {
      Object.assign(this.option, data.option);
    },
    // 提交配置
    submitOption: function (data) {
      this.option.radar =null;
      if (data.xAxis && data.xAxis.data) {
        this.option.xAxis.data = data.xAxis.data;
      }
      if (data.series) {
        this.option.series = [];
        this.option.series = data.series;
      }
      if(this.charts.type == 'radar'){
        this.option.radar = data.radar;
        this.option.tooltip ={};
      }
      if (data.grid) {
        this.option.grid = null;
        this.option.grid = data.grid;
      }
      this.$emit('getProp', this.option);
    },
    backgroundOption:function(data){
      this.$emit('getBackground', data);
    }
  },
  props: ['setProp', 'charts']  
};
</script>

