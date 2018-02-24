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
            <el-button class="chart_type" @click="onClickType(type,option.chartTypes[type].allowUse)" :class="[option.chartTypes[type].allowUse? 'isAllow':'',type]">
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
          {
            conj: 'and',
            name: 'price',
            op: 'gt',
            values: [
              1
            ]
          },
          {
            conj: 'and',
            name: 'qty',
            op: 'lt',
            values: [
              99999
            ]
          },
          {
            conj: 'and',
            exprs: [
              {
                conj: 'or',
                name: 'type',
                op: 'eq',
                values: [
                  'requirement'
                ]
              },
              {
                conj: 'or',
                name: 'status',
                op: 'in',
                values: [
                  'closed',
                  'done'
                ]
              }
            ]
          }
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
  props:['charts','tableShow','echartsShow','setqueryInfo'],
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
      this.thisChartsTypes=typeName;
      Object.assign(this.chart,this.charts);
      if (typeName === 'table') {
        if (!typeAllowUse) return;
        this.option.echartsShow = false;
        this.option.tableShow = true;
      }else{
        if (!typeAllowUse) return;
        this.option.echartsShow = true;
        this.option.tableShow = false;
      }
      this.chart.type=typeName;
      if(typeName=='pie'||typeName=='area'||typeName=='funnel'||typeName=='rosePie'||typeName=='radar'||typeName=='treemap'){
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
      return chartTypes[a].weight - chartTypes[b].weight;
    });
  }
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
  width:40px;
  height:40px;
  text-align: center;
  margin:0 13px 4px 0;
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
  width:32px;
  height:32px;
  vertical-align: middle;
}
.bar{
  background: url('../../assets/images/icon.png') -2px -42px no-repeat;
}
.line{
  background: url('../../assets/images/icon.png') -42px -42px no-repeat;
}
.pie{
  background: url('../../assets/images/icon.png') -82px -42px no-repeat;
}
.table{
  background: url('../../assets/images/icon.png') -122px -42px no-repeat;
}
.area{
  background: url('../../assets/images/icon.png') -162px -42px no-repeat;
}
.stackbar{
  background: url('../../assets/images/icon.png') -202px -42px no-repeat;
}
.funnel{
  background: url('../../assets/images/icon.png') -242px -42px no-repeat;
}
.rosePie{
  background: url('../../assets/images/icon.png') -282px -42px no-repeat;
}
.radar{
  background: url('../../assets/images/icon.png') -322px -42px no-repeat;
}
.treemap{
  background: url('../../assets/images/icon.png') -362px -42px no-repeat;
}
.waterfall{
  background: url('../../assets/images/icon.png') -402px -42px no-repeat;
}
.gauge{
  background: url('../../assets/images/icon.png') -442px -42px no-repeat;
}
.isAllow{
  background-position-y:-2px; 
}
</style>
