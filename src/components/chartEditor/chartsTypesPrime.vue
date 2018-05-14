<template>
  
</template>
<script type="text/babel">
import chartTypes from '../../assets/js/chart_types_prime';

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
export default {
  mounted() {
    let that = this;
    // 初始化页面数据
    Object.assign(that.chart, that.charts);
    this.option.echartsShow = this.echartsShow;
    this.option.tableShow = this.tableShow;
  },
  data: () => ({
    // 页面初始化
    init: 1,
    activeNames: ['1'],
    option: {
      chartTypes: chartTypes,
      //echarts显示
      echartsShow: false,
      //table显示
      tableShow: false,
      queryInfo: {
        valueColumns: [],
        categoryColumns: [],
        filters: []
      },
      rule: {
        columns: {}
      }
    },
    chart: {},
    chartsTypes: [],
    thisChartsTypes: '',
    sortArr: [],
    weightArr: []
  }),
  methods: {
    // 根据数据判断是否满足图表显示条件，不满足显示报表
    checkChartType() {
      let that = this;
      Object.assign(that.chart, that.charts);
      Object.assign(that.option.queryInfo, that.setqueryInfo);
      let queryInfo = that.option.queryInfo,
        chartTypes = that.option.chartTypes;
      const columnNum = queryInfo.categoryColumns.length,
        valueNum = queryInfo.valueColumns.length;
      that.option.tableShow = false;
      that.option.echartsShow = true;

      

      // 循环所有类型
      for (const key in chartTypes) {
        if (chartTypes.hasOwnProperty(key) && key == that.chart.type) {
          const type = chartTypes[key],
            rules = type.rules;
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (!evalConditional(columnNum, rule.columns.rule, rule.columns.num)) {
              that.$message({ message: '维度需要'+rule.columns.num+'个字段，目前'+columnNum+'个', type: 'warning' });
              that.option.tableShow = true;
              that.option.echartsShow = false;
              break
            }
            if (!evalConditional(valueNum, rule.values.rule, rule.values.num)) {
              that.$message({ message: '数值需要'+rule.values.num+'个字段，目前'+valueNum+'个', type: 'warning' });
              that.option.tableShow = true;
              that.option.echartsShow = false;
              break              
            }
          }
        }
      }
      this.chart.option.xAxis.show = false;
      this.chart.option.yAxis.show = false;
      that.$emit('getCharts', that.chart);
      that.$emit('gettableShow', that.option.tableShow);
      that.$emit('getechartsShow', that.option.echartsShow);
    }
  },
  props: ['charts', 'tableShow', 'echartsShow', 'setqueryInfo']
};
</script>
<style scoped>

</style>
