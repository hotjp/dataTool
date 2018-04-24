<template>
  <div class="series">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="图表类型" name="1">
        <div class="box">
          <el-tooltip placement="bottom" transition="0s" effect="light" v-for="(type,key) in sortArr" :key="type">
            <div slot="content">
              <span class="chart_type_tit">{{option.chartTypes[type].name}}</span><br>
              <div class="chart_type_btn" v-for="(rule,index) in option.chartTypes[type].rules" :key="index">
                <span>维度 {{rule.columns.text}}</span><br>
                <span>数值 {{rule.values.text}}</span>
              </div>
            </div>
            <el-button class="chart_type" @click="onClickType(type,option.chartTypes[type].allowUse)" :class="[option.chartTypes[type].allowUse? 'isAllow':'', type, thisChartsTypes == type?'active':'']">
              <i class="chart_type_icon"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script type="text/babel">
import chartTypes from '../../assets/js/chart_types';
function evalConditional(first, condition, second) {
  if (arguments.length != 3) {
    console.error('参数不足');
    return false;
  }

  if (second == 'any') {
    second = first;
  }
  if (isNaN(first) || isNaN(second)) {
    console.error('数据包含非数字');
    return false;
  }
  return new Function('return ' + first + condition + second)();
}
export default{
  mounted(){
    let that=this;
    // 初始化页面数据
    Object.assign(that.chart,that.charts);
    this.option.echartsShow=this.echartsShow;
    this.option.tableShow=this.tableShow;
    this.sortArr=Object.keys(chartTypes).sort(function(a,b){
      return chartTypes[a].sort - chartTypes[b].sort;
    });
    this.weightArr=Object.keys(chartTypes).sort(function(a,b){
      return chartTypes[b].weight - chartTypes[a].weight ;
    });
  },
  data:()=>({
    // 页面初始化
    init:1,
    activeNames:['1'],
    option:{
      chartTypes: chartTypes,
      //echarts显示
      echartsShow: false,
      //table显示
      tableShow: false,
      queryInfo: {
        valueColumns: [],
        categoryColumns: [],
        filters: [
          // {
          //   conj: 'and',
          //   name: 'price',
          //   op: 'gt',
          //   values: [
          //     1
          //   ]
          // },
          // {
          //   conj: 'and',
          //   name: 'qty',
          //   op: 'lt',
          //   values: [
          //     99999
          //   ]
          // },
          // {
          //   conj: 'and',
          //   exprs: [
          //     {
          //       conj: 'or',
          //       name: 'type',
          //       op: 'eq',
          //       values: [
          //         'requirement'
          //       ]
          //     },
          //     {
          //       conj: 'or',
          //       name: 'status',
          //       op: 'in',
          //       values: [
          //         'closed',
          //         'done'
          //       ]
          //     }
          //   ]
          // }
        ]
      },
      rule: {
        columns: {}
      }
    },
    chart:{},
    chartsTypes:[],
    thisChartsTypes:'',
    sortArr:[],
    weightArr:[]
  }),
  methods:{
    // 根据数据确定哪些图表可用
    checkChartType() {
      Object.assign(this.option.queryInfo,this.setqueryInfo);
      let that = this,
        queryInfo = that.option.queryInfo,
        chartTypes = that.option.chartTypes;
      const columnNum = queryInfo.categoryColumns.length,
        valueNum = queryInfo.valueColumns.length;
      // 循环所有类型
      for (const key in chartTypes) {
        if (chartTypes.hasOwnProperty(key)) {
          const type = chartTypes[key],
            rules = type.rules;
          // 禁用全部
          type.allowUse = false;
          // 循环条件
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            // 如果构建条件语句成功则启用
            if (evalConditional(columnNum, rule.columns.rule, rule.columns.num) && evalConditional(valueNum, rule.values.rule, rule.values.num)) {
              type.allowUse = true;
            }
          }
        }
      }
      that.chartsTypes=[];
      for(let j in that.option.chartTypes){
        if(that.option.chartTypes[j].allowUse){
          that.chartsTypes.push(j);
        }
      }
      // 权重高的图表类型
      let firstType='';
      for(var m=0;m<that.weightArr.length;m++){
        for(var n=0;n<that.chartsTypes.length;n++){
          if(that.weightArr[m]==that.chartsTypes[n] && firstType==''){
            firstType=that.weightArr[m];
          }
        }
      }
      for(let i=0;i<that.chartsTypes.length;i++){
        if(that.chartsTypes[i]==that.chart.type){
          that.thisChartsTypes=that.chartsTypes[i];
          break;
        }else{
          that.thisChartsTypes=firstType?firstType:that.chartsTypes[0];
        }
      }
      
      if(this.init&&that.charts.type){
        that.chartsTypes.unshift(that.charts.type);
        that.thisChartsTypes=that.charts.type;
      }
      
      that.init=0;
      that.chart.type=that.thisChartsTypes;
      if(that.chartsTypes.length){
        if(that.chart.type=='table'){
          that.option.tableShow=true;
          that.option.echartsShow=false;
        }else{
          that.option.tableShow=false;
          that.option.echartsShow=true;
        }
      }
      that.$emit('getCharts',this.chart);      
      that.$emit('gettableShow',this.option.tableShow);
      that.$emit('getechartsShow',this.option.echartsShow);
    },
    // 通过索引替换主题
    //    onClickChangeTheme(index) {
    //      this.themeName = this.themeNames[index].value;
    //    },
    // 点击切换图表
    onClickType(typeName, typeAllowUse) {
      // TODO:图表的点击切换
      if (!typeAllowUse){
        return false;
      }

      this.thisChartsTypes=typeName;
      Object.assign(this.chart,this.charts);
      if (typeName === 'table') {
        this.option.echartsShow = false;
        this.option.tableShow = true;
      }else{
        this.option.echartsShow = true;
        this.option.tableShow = false;
      }
      this.chart.type=typeName;
      
      if(typeName=='pie'||typeName=='area'||typeName=='funnel'||typeName=='rosePie'||typeName=='radar'||typeName=='treemap'||typeName=='gauge'||typeName=='wordCloud'){
        this.chart.option.xAxis.show = false;
        this.chart.option.yAxis.show = false;
      }else{
        this.chart.option.xAxis.show = true;
        this.chart.option.yAxis.show = true;
      }
      this.$emit('getCharts',this.chart);
      this.$emit('gettableShow',this.option.tableShow);
      this.$emit('getechartsShow',this.option.echartsShow);
    }
  },
  props:['charts','tableShow','echartsShow','setqueryInfo']  
};
</script>
<style scoped>
.title{
  font-size: 12px;
  font-weight: 700;
}
.box{
  margin-top: 10px;
}
.chart_type{
  width:25px;
  height:25px;
  text-align: center;
  margin:0 0 9px 13px;
  padding:0;
  border:none;
  overflow: hidden;
}
.chart_type_tit{
  font-size: 12px;
  font-weight: 700;
}
.chart_type_btn{
  margin-top: 2px;
}
.chart_type_icon{
  display: inline-block;
  width:25px;
  height:25px;
  vertical-align: middle;
}
/* FIXME: 背景图缩放为62.6% */
.bar{
  background: url('../../assets/images/icon.png') 0px -26px no-repeat;
  background-size: 500px;
}
.line{
  background: url('../../assets/images/icon.png') -25px -26px no-repeat;
  background-size: 500px;
}
.pie{
  background: url('../../assets/images/icon.png') -50px -26px no-repeat;
  background-size: 500px;
}
.table{
  background: url('../../assets/images/icon.png') -76px -26px no-repeat;
  background-size: 500px;
}
.area{
  background: url('../../assets/images/icon.png') -100px -26px no-repeat;
  background-size: 500px;
}
.stackbar{
  background: url('../../assets/images/icon.png') -125px -26px no-repeat;
  background-size: 500px;
}
.funnel{
  background: url('../../assets/images/icon.png') -150px -26px no-repeat;
  background-size: 500px;
}
.rosePie{
  background: url('../../assets/images/icon.png') -175px -26px no-repeat;
  background-size: 500px;
}
.radar{
  background: url('../../assets/images/icon.png') -200px -26px no-repeat;
  background-size: 500px;
}
.treemap{
  background: url('../../assets/images/icon.png') -225px -26px no-repeat;
  background-size: 500px;
}
.waterfall{
  background: url('../../assets/images/icon.png') -250px -26px no-repeat;
  background-size: 500px;
}
.gauge{
  background: url('../../assets/images/icon.png') -275px -26px no-repeat;
  background-size: 500px;
}
.wordCloud{
  background: url('../../assets/images/icon.png') -300px -26px no-repeat;
  background-size: 500px;
}
.percentStackbar{
  background: url('../../assets/images/icon.png') -325px -26px no-repeat;
  background-size: 500px;   
}
.isAllow{
  background-position-y:-1px; 
}
.active{
  box-shadow: 0 0 0 1px #3b90ff;
}
</style>
