<template>
<el-collapse  v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="计量图" name="1">
    <div class="comp_group fix">
      <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
          {{item.name}} 最大值：
          <el-input class="range_input" type="text" v-model="item.max"></el-input>
          <p class="item_name">区间颜色设置</p>
          
          <div class="fix">
            <el-input class="l range_input" type="text" v-model="item.axisLine.lineStyle.color[0][0]"></el-input>
            <colorPicker class="color_picker" :color.sync="item.axisLine.lineStyle.color[0][1]" ></colorPicker>
          </div>
          <div class="fix">
            <el-input class="l range_input" type="text" v-model="item.axisLine.lineStyle.color[1][0]"></el-input>  
            <colorPicker class="color_picker" :color.sync="item.axisLine.lineStyle.color[1][1]" ></colorPicker>
          </div>
          <div class="fix">
            <el-input class="l range_input" type="text" v-model="item.axisLine.lineStyle.color[2][0]"></el-input>  
            <colorPicker class="color_picker" :color.sync="item.axisLine.lineStyle.color[2][1]" ></colorPicker>
          </div>
      </div>
    </div>
  </el-collapse-item>
  
</el-collapse>
</template>

<script>
import axios from "axios";

import seriesDefault from "../../vendor/seriesGauge.json";
import "../../vendor/jsVendor/seriesGauge.js";

import colorPicker from "../chartEditor/propSelect/colorPicker.vue";

export default {
  components: {
    colorPicker
  },
  created() {
    this.dataChange();
  },
  mounted() {
    let that = this;
    (() => Object.assign(that.chartData, that.data))();
  },
  data: () => ({
    // 返回父级的数据，包括series和xAxis与yAxis的data部分
    seriesOption: {
      option: {
        series: [],
        xAxis: {}
      }
    },
    // 数据
    chartData: {},
    // 默认配置项展开
    activeNames: ["1"],
    // 图表类型
    pageName: "计量图",
    type: "gauge",
    // 第一次进入页面
    firstFlag: true
  }),
  watch: {
    seriesOption: {
      handler: function(newVal, oldVal) {
        this.$emit("getSeries", this.seriesOption.option);
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
  },
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
      // that.seriesOption.option.xAxis
      //   ? (that.seriesOption.option.xAxis.data = [])
      //   : (that.seriesOption.option.xAxis = {});
      newData.xAxis = that.seriesOption.option.xAxis;

      let arr = queryNameY.map(function(x) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == x) {
            return columns[i].source.text;
          }
        }
      });
      newData.xAxis.data = arr;

      // series.data的数据
      if (that.firstFlag) {
        newData.series = seriesGauge(
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
        newData.series = seriesGauge(
          columns,
          rows,
          queryNameKeyX,
          queryNameKeyY,
          seriesDefault
        );
      }

      that.firstFlag = false;
      that.$set(this.seriesOption.option, "grid", seriesDefault.grid);
      that.$set(this.seriesOption.option, "xAxis", newData.xAxis);
      that.$set(this.seriesOption.option, "series", newData.series);
      that.$emit("getSeries", that.seriesOption.option);
    }
  },
  props: ["option", "data"]
};
</script>
<style scoped>
.item_name {
  margin-left: 0;
}
</style>