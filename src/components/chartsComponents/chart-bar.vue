<template>
<el-collapse  v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="柱状图" name="1">
    <div class="comp_group fix">
      <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
          <colorPicker class="color_picker" :color.sync="item.itemStyle.normal.color" ></colorPicker>
          <p class="l item_name">{{item.name}}</p>
      </div>
    </div>
  </el-collapse-item>
</el-collapse>
</template>

<script>
import Vue from 'vue';

import seriesDefault from '../../vendor/seriesBar.json';
import '../../vendor/jsVendor/seriesBar.js';

import colorPicker from '../chartEditor/propSelect/colorPicker.vue';

export default {
  data() {
    return {
      // 返回父级的数据，包括series和xAxis与yAxis的data部分
      seriesOption: {
        option: {
          series: [],
          xAxis: {}
        }
      },
      //默认series数据
      seriesItem: seriesDefault,
      // 数据
      chartData: {},
      // 默认配置项展开
      activeNames: ['1'], 
      // 图表类型
      type: 'bar',
      pageName: '柱状图',
      // 第一次进入页面
      firstFlag: true
    };
  },
  mounted() {
    let that = this;
    (() => Object.assign(that.chartData, that.data))();
  },
  created() {
    this.dataChange();
  },
  components: {
    colorPicker
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
      newData.xAxis = that.seriesOption.option.xAxis;
      if (queryNameKeyX.length) {
        for (let i = 0; i < queryNameKeyX.length; i++) {
          let arr = [];
          for (let j = 0; j < rows.length; j++) {
            arr.push(rows[j][queryNameKeyX[i]]);
          }
          newData.xAxis.data = arr;
        }
      } else {
        let arr = queryNameY.map(function(x) {
          for (let i = 0; i < columns.length; i++) {
            if (columns[i].source.name == x) {
              return columns[i].source.text;
            }
          }
        });
        newData.xAxis.data = arr;
      }
      // series.data的数据
      if (that.firstFlag) {
        newData.series = seriesBar(
          columns,
          rows,
          queryNameKeyX,
          queryNameKeyY,
          seriesDefault,
          that.option.series,
          true
        );
      } else {
        // 新建
        newData.series = seriesBar(
          columns,
          rows,
          queryNameKeyX,
          queryNameKeyY,
          seriesDefault
        );
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