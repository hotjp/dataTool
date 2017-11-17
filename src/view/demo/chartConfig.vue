<template>
  <div class="chartConfig">
    <prop-title @titleText="getTitle" :setTitle="option.title"></prop-title>
    <prop-xaxis @xaxisOptions="getOptions" :setXaxis="option.xaxis"></prop-xaxis>
  </div>
</template>
<script type="text/babel">
import title from '../../components/title.vue';
import xaxis from '../../components/xaxis.vue';
export default{
  data:()=>({
    option:{
      title:{
        text:'一个新图表'
      },
      xaxis:{
        axisLine:{
          show: true
        },
        lineStyle:{
          type:'solid',
          width:'1',
          color:'#000'
        },
        axisLabel:{
          show:true,
          fontFamily:'sans-serif',
          fontSize:'10px',
          color:'#000'
        }
      }
    }
  }),
  components:{
    'prop-title':title,
    'prop-xaxis':xaxis
  },
  methods:{
    getTitle:function(data){
      Object.assign(this.option.title,data);
    },
    getOptions:function(data){
      Object.assign(this.option,data);      
    }
  },
  watch:{
    option:{
      handler:function(val,oldval){  
        // 发数据
        console.log(val);

      },
      deep:true
    }
  }
};
</script>

