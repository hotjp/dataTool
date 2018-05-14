<template>
<!-- <el-collapse  v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="柱状图" name="1">
    <div class="comp_group fix">
      <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
          <colorPicker class="color_picker" :color.sync="item.itemStyle.normal.color" ></colorPicker>
          <p class="l item_name">{{item.name}}</p>
      </div>
    </div>
  </el-collapse-item>
</el-collapse> -->
</template>

<script>
import seriesDefault from "../../vendor/seriesBar3D.json";
import "../../vendor/jsVendor/seriesBar3D.js";

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
    //默认series数据
    seriesItem: seriesDefault,
    // 数据
    chartData: {},
    // 默认配置项展开
    activeNames: ["1"],
    // 图表类型
    type: "bar3D",
    pageName: "3D柱状图"
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
      // x，y，z轴数据
      newData.xAxis3D = that.seriesOption.option.xAxis3D||{};
      newData.yAxis3D = that.seriesOption.option.yAxis3D||{};
      newData.zAxis3D = that.seriesOption.option.zAxis3D||{};
      newData.grid3D = that.seriesOption.option.grid3D||{};
      // newData.grid3D = that.seriesItem.grid3D||{};
      
      if(!queryNameKeyX.length ==2 || !queryNameKeyY.length==1){
        return
      }
      if (queryNameKeyX.length) {
        for (let i = 0; i < queryNameKeyX.length; i++) {
          let arr = [];
          for (let j = 0; j < rows.length; j++) {

            // FIXME: 接口需调整，目前根据x，y的值判断，如果存在重复值会出问题,最好返回x和y都包含什么值
            if(arr.indexOf(rows[j][queryNameKeyX[i]])<0){
              arr.push(rows[j][queryNameKeyX[i]]);
            }
          }
          if(i==0){
            newData.xAxis3D.data = arr;
          }else if(i==1){
            newData.yAxis3D.data = arr;
          }
        }
      }
      // series.data的数据
      newData.series = seriesBar3D(
        columns,
        rows,
        queryNameKeyX,
        queryNameKeyY,
        seriesDefault,
        that.option.series,
        true
      );

      that.$set(this.seriesOption.option, "xAxis3D", newData.xAxis3D);
      that.$set(this.seriesOption.option, "yAxis3D", newData.yAxis3D);
      that.$set(this.seriesOption.option, "zAxis3D", newData.zAxis3D);
      that.$set(this.seriesOption.option, "grid3D", newData.grid3D);
      
      that.$set(this.seriesOption.option, "series", newData.series);
      that.$emit("getSeries", that.seriesOption.option);
    }
  },
  props: ["option", "data"]
};
</script>
<style>

</style>