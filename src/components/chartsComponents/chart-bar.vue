<template>
<el-collapse @change="handleChange" id="chartsComponents">
  <el-collapse-item title="柱状图" name="1">
    <div class="comp_group fix">
      <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
          <el-color-picker class="color_picker" @change="colorChange" v-model="item.itemStyle.normal.color"></el-color-picker>    
          <p class="l item_name">{{item.name}}</p>
      </div>
    </div>
  </el-collapse-item>
  
</el-collapse>
</template>

<script>
import axios from "axios";
import seriesDefault from "../../vendor/seriesBar.json";
import "../../vendor/seriesBar.js";
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
          series: [],
          xAxis:{}
        }
      },
      //默认series数据
      seriesItem: seriesDefault,
      // 数据
      chartData: {},
      // 柱状图
      pageName: "柱状图",
      activeNames: [], // 展开的组
      type: "bar"
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
    colorChange() {
      // this.$emit("getSeries", this.seriesOption.option);
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
      // that.seriesOption.option.xAxis
      //   ? (that.seriesOption.option.xAxis.data = [])
      //   : (that.seriesOption.option.xAxis = {});
      newData.xAxis = that.seriesOption.option.xAxis;
      for (let i = 0; i < queryNameKeyX.length; i++) {
        let arr = [];
        for (let j = 0; j < rows.length; j++) {
          arr.push(rows[j][queryNameKeyX[i]]);
        }
        newData.xAxis.data = arr;
      }
      
      // series.data的数据
      // if (queryNameKeyY.length > 1) {
        // 多个数值
        // let arr = [];
        // for (let i = 0; i < queryNameKeyY.length; i++) {
        //   let copy = JSON.parse(JSON.stringify(seriesDefault));
        //   arr.push({
        //     data: rows.map(x => x[queryNameKeyY[i]]),
        //     type: that.type,
        //     itemStyle: copy.itemStyle,
        //     name: queryNameKeyY[i]
        //   });
        // }
        // that.seriesOption.option.series = arr;
        newData.series = seriesBar(rows,queryNameKeyY,seriesDefault);
      // } else {
        // 一个数值
        // let arr = [];
        // let copy = JSON.parse(JSON.stringify(seriesDefault));
        // arr.push({
        //   data: rows.map(x => x[queryNameKeyY[0]]),
        //   type: that.type,
        //   itemStyle: copy.itemStyle,
        //   name: queryNameKeyY[0]
        // });
        // that.seriesOption.option.series = arr;
        // newData.series = arr;
      // }
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
    },
    option:{
      // 父级传来的图表数据
      handler: function(newVal, oldVal) {
        // this.seriesOption.option = Object.assign({},this.seriesOption.option,this.option)
      },
      deep: true
    },

  }
};
</script>
<style>

</style>