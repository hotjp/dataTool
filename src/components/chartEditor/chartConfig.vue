<template>
  <div class="chartConfig">
    <prop-title class="series" @titleText="getTitle" :setTitle="option.title"></prop-title>
    <prop-xaxis v-if="charts.type!='table'" class="series" @xaxisOptions="getOptions" :setXaxis="option.xAxis"></prop-xaxis>
    <prop-yaxis v-if="charts.type!='table'" class="series" @yaxisOptions="getOptions" :setYaxis="option.yAxis"></prop-yaxis>
    <prop-legend v-if="charts.type!='table'" class="series" @legendOptions="getOptions" :propData="setProp" :setLegend="option.legend" :chartsType="charts.type"></prop-legend>
    <chartTypeOption class="series" :option="option" :data="setProp" :type="charts.type" @submitOption="submitOption"></chartTypeOption>
  </div>
</template>
<script type="text/babel">
import defaultData from '../../vendor/defaultOption.json';
import title from './title.vue';
import xaxis from './xaxis.vue';
import yaxis from './yaxis.vue';
import legend from './legend.vue';
import chartTypeOption from './chartTypeOption.vue';
export default {
  data: () => ({
    option: {
    },
    graphData: {}
  }),
  components: {
    'prop-title': title,
    'prop-xaxis': xaxis,
    'prop-yaxis': yaxis,
    'prop-legend': legend,
    chartTypeOption: chartTypeOption
  },
  props: ['setProp', 'charts'],
  methods: {
    // 获取图表标题的值
    getTitle: function (data) {
      Object.assign(this.option.title, data);
    },
    // 获取图表配置
    getOptions: function (data) {
      Object.assign(this.option, data.option);
    },
    // 提交配置
    submitOption: function (data) {
      // this.option= _.merge({},this.option, data);
      this.option.radar =null;
      if (data.xAxis && data.xAxis.data) {
        this.option.xAxis.data = data.xAxis.data;
      }
      if (data.series) {
        this.option.series = [];
        this.option.series = data.series;
        // Object.assign([],this.option.series,data.series);
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
    }
  },
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
  beforeMount() {
    Object.assign(this.option, defaultData.option, this.charts.option);
  }
};
</script>

