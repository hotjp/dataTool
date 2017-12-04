<template>
  <div class="chartConfig">
    <prop-title @titleText="getTitle" :setTitle="option.title"></prop-title>
    <prop-xaxis @xaxisOptions="getOptions" :setXaxis="option.xAxis"></prop-xaxis>
    <!-- <prop-yaxis @yaxisOptions="getOptions" :setXaxis="option.yAxis"></prop-yaxis> -->
    <chartTypeOption :option="option" :data="setProp" @submitOption="submitOption"></chartTypeOption>
  </div>
</template>
<script type="text/babel">
import defaultData from '../../vendor/defaultOption.json';
import title from '../../components/title.vue';
import xaxis from '../../components/xaxis.vue';
import yaxis from '../../components/yaxis.vue';
import chartTypeOption from '../../components/chartTypeOption.vue';

export default{
  data:()=>({
    option:{
      title:{
        text:'一个新图表'
      },
      xAxis:{
        axisLine:{
          show: true,
          lineStyle:{
            type:'solid',
            width:'1',
            color:'#000'
          }
        },
        axisLabel:{
          show:true,
          fontFamily:'sans-serif',
          fontSize:'10',
          color:'#000'
        }
      },
      yAxis : {}
    },
    graphData:{}
  }),
  components:{
    'prop-title':title,
    'prop-xaxis':xaxis,
    'prop-yaxis':yaxis,
    'chartTypeOption':chartTypeOption
  },
  props:['setProp','charts'],
  methods:{
    getTitle:function(data){
      Object.assign(this.option.title,data);
    },
    getOptions:function(data){
      Object.assign(this.option.xAxis,data);    
    },
    submitOption:function(data){
      Object.assign(this.option,data); 
    }
  },
  watch:{
    option:{
      handler:function(val,oldval){  
        // 发数据
        this.$emit('getProp',this.option);
      },
      deep:true
    },
    setProp:{
      handler:function(val,oldval){
      },
      deep:true
    }
  },
  mounted(){
    Object.assign(this.option,defaultData.option,this.charts.option); 
  }
};
</script>

