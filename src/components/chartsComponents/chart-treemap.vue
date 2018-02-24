<template>
<!-- <el-collapse v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="矩形树图" name="1">
    <div class="comp_group fix"> -->
      <!-- <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
          {{item.name}}
          <el-color-picker class="color_picker" v-model="item.itemStyle.normal.color"></el-color-picker>    
      </div> -->
    <!-- </div>
  </el-collapse-item>
</el-collapse> -->
</template>

<script>
import Vue from 'vue';

import seriesDefault from '../../vendor/seriesTreemap.json';
import '../../vendor/jsVendor/seriesTreemap.js';

export default {
  data() {
    return {
      // 返回父级的数据，包括series和xAxis与yAxis的data部分
      seriesOption: {
        option: {
          series: []
        }
      },
      // 数据
      chartData: {},
      // 默认配置项展开
      activeNames: ['1'],
      // 图表类型
      type: 'treemap',
      pageName: '面积图',
      // 第一次进入页面
      firstFlag:true
    };
  },
  mounted() {
    let that = this;
    (() => Object.assign(that.chartData, that.data))();
  },
  created() {
    this.dataChange();
  },
  props: ['option', 'data'],
  methods: {
    // 数据处理
    dataChange() {
      let that = this;
      let newData = {};
      if (that.data.dataError || !that.data.data) {
        return;
      }
      let query = that.data.query;
      let columns = that.data.data.columns;
      let rows = that.data.data.rows;

      // 获取维度和数值的name
      let queryNameX = query.categoryColumns.map(x => x.name);
      let queryNameY = query.valueColumns.map(x => x.name);
      // 根据name获取对应的key
      let queryNameKeyX = queryNameX.map(function(x) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == x) {
            return columns[i].name;
          }
        }
      });
      let queryNameKeyY = queryNameY.map(function(x) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == x) {
            return columns[i].name;
          }
        }
      });
      that.seriesOption.option.series = [];

      // xAxis数据 数组
      that.seriesOption.option.xAxis
        ? (that.seriesOption.option.xAxis.data = [])
        : (that.seriesOption.option.xAxis = {});
      newData.xAxis = that.seriesOption.option.xAxis;
      for (let i = 0; i < queryNameKeyX.length; i++) {
        let arr = [];
        for (let j = 0; j < rows.length; j++) {
          arr.push(rows[j][queryNameKeyX[i]]);
        }
        newData.xAxis.data = arr;
      }
      // series.data的数据
      if(that.firstFlag){
        // 第一次进入页面        
        newData.series = seriesTreemap(columns,rows,queryNameKeyX,queryNameKeyY,seriesDefault,that.option.series,true);
      }else{
        newData.series = seriesTreemap(columns,rows,queryNameKeyX,queryNameKeyY,seriesDefault);
      }
    
      that.firstFlag = false;
      Vue.set(this.seriesOption.option, 'grid', seriesDefault.grid);
      Vue.set(this.seriesOption.option, 'xAxis', newData.xAxis);
      Vue.set(this.seriesOption.option, 'series', newData.series);
      that.$emit('getSeries', that.seriesOption.option);
    }
  },
  watch: {
    seriesOption: {
      handler: function(newVal, oldVal) {
        this.$emit('getSeries', this.seriesOption.option);
      },
      deep: true
    },
    data: {
      // 父级传来的图表数据
      handler: function(newVal, oldVal) {
        this.dataChange();
      },
      deep: true
    }
  }
};
</script>
<style>

</style>