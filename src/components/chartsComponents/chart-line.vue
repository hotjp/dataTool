<template>
<el-collapse @change="handleChange" id="chartsComponents">
  <el-collapse-item title="折线图" name="1">
    <div class="comp_group fix">
      <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
          {{item.name}}
          <el-color-picker class="color_picker" v-model="item.itemStyle.normal.color"></el-color-picker>    
      </div>
    </div>
    <!-- <div class="comp_group fix">
      <el-switch
        v-model="smooth"
        active-color="#5182E4"
        @change="smoothChange"
        inactive-color="#cccccc">
      </el-switch> 平滑曲线
    </div> -->
    
    
  </el-collapse-item>
  
</el-collapse>
</template>

<script>
import axios from "axios";
import seriesDefault from "../../vendor/seriesLine.json";
import "../../vendor/seriesLine.js";
import Vue from "vue";

export default {
  beforeMount() {
    // 挂载前
  },
  mounted() {
    let that = this;
    // (() => Object.assign(that.seriesOption.option, that.option))();
    (() => Object.assign(that.chartData, that.data))();
    if ("undefined" == typeof that.seriesOption.option.series) {
      that.seriesOption.option.series = [];
    }
    for (let i = 0; i < that.seriesOption.option.series.length; i++) {
      let copy = JSON.parse(JSON.stringify(seriesDefault));
      that.seriesOption.option.series[i] = Object.assign(
        {},
        copy,
        that.seriesOption.option.series[i]
      );
    }
  },
  created() {
    this.dataChange();
  },
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
      activeNames: [], // 展开的组
      type: "line",
      smooth:false // TODO: 取值
    };
  },
  props: ["option", "data"],
  computed: {
    // 计算
  },
  methods: {
    // TODO 数据操作
    handleChange() {
      // this.$emit("getSeries", this.seriesOption.option);
    },
    smoothChange(data) {
      for(let i=0;i<this.seriesOption.option.series.length;i++){
        this.seriesOption.option.series[i].smooth = data
      }
      this.seriesOption.option = Object.assign({},this.seriesOption.option);
    },
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
        // that.seriesOption.option.xAxis.data = arr;
      }
      // series.data的数据
      newData.series = seriesLine(rows, queryNameKeyY, seriesDefault);

      // that.$set(this.seriesOption, "option", newData);
      Vue.set(this.seriesOption.option, "xAxis", newData.xAxis);
      Vue.set(this.seriesOption.option, "series", newData.series);
      that.$emit("getSeries", that.seriesOption.option);
    }
  },
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
  }
};
</script>
<style>

</style>