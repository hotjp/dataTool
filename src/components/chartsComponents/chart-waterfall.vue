<template>
<el-collapse  v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="瀑布图" name="1">
    <div class="comp_group fix">
      <div v-for="(item,index) in seriesOption.option.series" :key="index" v-if="index!=0"  class="colums_list">
          <colorPicker class="color_picker" :color.sync="item.itemStyle.normal.color" ></colorPicker>
          <p class="l item_name">{{item.name}}</p>
      </div>
    </div>
  </el-collapse-item>
</el-collapse>
</template>

<script>
import seriesDefault from "../../vendor/seriesWaterfall.json";
import "../../vendor/jsVendor/seriesWaterfall.js";

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
    type: "bar",
    pageName: "瀑布图"
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
    },
    "seriesOption.option.series": {
      // 父级传来的图表数据
      handler: function(newVal, oldVal) {
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].itemStyle.normal.color == "transparent") {
            this.seriesOption.option.series[i].itemStyle.normal.color = null;
          }
        }
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
      if (queryNameKeyX.length) {
        for (let i = 0; i < queryNameKeyX.length; i++) {
          let arr = ["总计"];
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
        arr.unshift("总计");
        newData.xAxis.data = arr;
      }

      // series.data的数据
      newData.series = seriesWaterfall(
        columns,
        rows,
        queryNameKeyX,
        queryNameKeyY,
        seriesDefault,
        that.option.series,
        true
      );

      that.$set(this.seriesOption.option, "grid", seriesDefault.grid);
      that.$set(this.seriesOption.option, "xAxis", newData.xAxis);
      that.$set(this.seriesOption.option, "series", newData.series);
      that.$emit("getSeries", that.seriesOption.option);
    }
  },
  props: ["option", "data"]
};
</script>
<style>

</style>