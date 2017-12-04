// TODO: 根据series的name判断取哪个data，而不是index
<template>
  <!-- <div @click="clickEvent">{{seriesOption}},{{data}}</div> -->
<el-collapse v-model="activeNames" @change="handleChange" id="chartBar">
  <el-collapse-item title="柱状图" name="1">
    <div class="comp_group fix">
      <!-- <el-input class="input" v-model="color1" placeholder=""></el-input> -->
      <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
          柱条的颜色
          <el-color-picker class="color_picker" v-model="item.itemStyle.normal.color"></el-color-picker>    
      </div>
      
    </div>
  </el-collapse-item>
  
</el-collapse>
</template>

<script>
import axios from "axios";
import seriesBar from "../../vendor/seriesBar.json";

export default {
  beforeMount() {
    // 挂载前
    
  },
  mounted() {
    let that = this;
    (() => Object.assign(that.seriesOption.option, that.option))();
    (() => Object.assign(that.chartData, that.data))();
    if ("undefined" == typeof that.seriesOption.option.series) {
      that.seriesOption.option.series = [];
    }
    for (let i = 0; i < that.seriesOption.option.series.length; i++) {
      let copy = JSON.parse(JSON.stringify(seriesBar));
      that.seriesOption.option.series[i] = Object.assign(
        {},
        copy,
        that.seriesOption.option.series[i]
      );
    }
    
  },
  data() {
    return {
      // 返回父级的数据，包括series和xAxis与yAxis的data部分
      seriesOption: {
        option: {
          series: [],
          xAxis: null,
          yAxis: null
        }
      },
      //默认series数据
      seriesItem: seriesBar,
      // 数据
      chartData: {},
      // 柱状图
      pageName: "柱状图",
      color1: "",
      activeNames: [] // 展开的组
    };
  },
  props: ["option", "data"],
  computed: {
    // 计算
  },
  methods: {
    clickEvent() {
      let that = this;
      that.seriesOption.series = Math.random();
    },
    // TODO 数据操作
    handleChange() {}
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
        let that = this;
        if (newVal.dataError || !newVal.data) {
          return;
        }
        let query = newVal.query;
        let columns = newVal.data.columns;
        let rows = newVal.data.rows;

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

        // xAxis数据,queryNameKeyX.length>1时是数组，否则是对象
        if (queryNameKeyX.length > 1) {
          that.seriesOption.option.xAxis = [];
          for (let i = 0; i < queryNameKeyX.length; i++) {
            let arr = [];
            for (let j = 0; j < rows.length; j++) {
              arr.push(rows[j][queryNameKeyX[i]]);
            }
            that.seriesOption.option.xAxis.push({ data: arr });
          }
          // that.seriesOption.option.xAxis.data = newVal;
        } else {
          that.seriesOption.option.xAxis = {
            data: rows.map(x => x[queryNameKeyX[0]])
          };
        }
        // series.data的数据
        if (queryNameKeyY.length > 1) {
          // 多个数值
          that.seriesOption.option.xAxis = [];
          for (let i = 0; i < queryNameKeyY.length; i++) {
            that.seriesOption.option.series[i].data = rows.map(
              x => x[queryNameKeyY[i]]
            );
          }
        } else {
          // 一个数值
          if (that.seriesOption.option.series.length) {
            that.seriesOption.option.series[0].data = rows.map(
              x => x[queryNameKeyY[0]]
            );
          } else {
            that.seriesOption.option.series.push(seriesBar);
            that.seriesOption.option.series[0].data = rows.map(
              x => x[queryNameKeyY[0]]
            );
          }
        }
        that.$emit("getSeries", that.seriesOption.option);
      },
      deep: true
    }
  }
};
</script>
<style>
#chartBar .el-collapse-item__arrow {
  float: left;
}
#chartBar .input {
  width: 70%;
  float: left;
}
#chartBar .color_picker {
  float: left;
}
</style>