<template>
  <div class="chartConfig">
    <prop-title class="series" @titleText="getTitle" :setTitle="option.title"></prop-title>
    <prop-xaxis v-if="charts.type!='table'"  class="series" @xaxisOptions="getOptions" :setXaxis="option.xAxis"></prop-xaxis>
    <prop-yaxis v-if="charts.type!='table'"  class="series" @yaxisOptions="getOptions" :setYaxis="option.yAxis"></prop-yaxis>
    <!-- <prop-yaxis @yaxisOptions="getOptions" :setXaxis="option.yAxis"></prop-yaxis> -->
    <chartTypeOption  class="series" :option="option" :data="setProp" :type="charts.type" @submitOption="submitOption"></chartTypeOption>
  </div>
</template>
<script type="text/babel">
import defaultData from '../../vendor/defaultOption.json';
import title from '../../components/chartEditor/title.vue';
import xaxis from '../../components/chartEditor/xaxis.vue';
import yaxis from '../../components/chartEditor/yaxis.vue';
import chartTypeOption from '../../components/chartEditor/chartTypeOption.vue';
export default{
  data:()=>({
    option:{
      title:{
        text:''
      },
      xAxis: {
        show:true,
        axisLine: {
          show: true,
          lineStyle: {
            type: 'solid',
            width: '1',
            color: '#000'
          }
        },
        axisLabel: {
          show: true,
          fontFamily: 'sans-serif',
          fontSize: '10',
          color: '#000'
        },
        data: []
      },
      yAxis: {
        show:true,
        axisLine: {
          show: true,
          lineStyle: {
            type: 'solid',
            width: '1',
            color: '#000'
          }
        },
        axisLabel: {
          show: true,
          fontFamily: 'sans-serif',
          fontSize: '10',
          color: '#000'
        },
        data: []
      }
    },
    graphData: {}
  }),
  components: {
    'prop-title': title,
    'prop-xaxis': xaxis,
    'prop-yaxis': yaxis,
    chartTypeOption: chartTypeOption
  },
  props: ['setProp', 'charts'],
  methods: {
    getTitle: function(data) {
      Object.assign(this.option.title, data);
    },
    getOptions: function(data) {
      Object.assign(this.option, data.option);
    },
    submitOption: function(data) {
      // this.option= _.merge({},this.option, data);
      if(data.xAxis && data.xAxis.data){
        this.option.xAxis.data = data.xAxis.data;
      }
      if(data.series ){
        this.option.series = [];
        this.option.series=data.series;
        // Object.assign([],this.option.series,data.series);
      }
      this.$emit('getProp', this.option);
    }
  },
  watch: {
    option: {
      handler: function(val, oldval) {
        // 发数据
        this.$emit('getProp', val);
      },
      deep: true
    },
    'charts.type': {
      handler: function(val, oldval) {
        this.option = Object.assign({},this.option,defaultData.option,this.charts.option);
      },
      deep: true
    }
  },
  beforeMount(){
    Object.assign(this.option,defaultData.option,this.charts.option);
  }
};
</script>

