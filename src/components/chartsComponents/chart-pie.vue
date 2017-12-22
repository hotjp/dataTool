<template>
  <!-- <div @click="clickEvent">{{seriesOption}},{{data}}</div> -->
<el-collapse v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="饼图" name="pie">
    <div class="comp_group fix">
      <!-- <el-input class="input" v-model="color1" placeholder=""></el-input> -->
      <!-- <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
          折线的颜色{{index}}
          <el-color-picker class="color_picker"   v-model="item.itemStyle.normal.color"></el-color-picker>    
      </div> -->
      
    </div>
  </el-collapse-item>
  
</el-collapse>
</template>

<script>
import axios from 'axios';
import seriesDefault from '../../vendor/seriesPie.json';
import "../../vendor/seriesPie.js";

export default {
  beforeMount() {},
  mounted() {
    let that = this;
    // (() => Object.assign(that.seriesOption.option, that.option))();
    (() => Object.assign(that.chartData, that.data))();
    if ('undefined' == typeof that.seriesOption.option.series) {
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
          xAxis: {},
          yAxis: {}
        }
      },
      //默认series数据
      seriesItem: seriesDefault,
      // 数据
      chartData: {},
      // 柱状图
      pageName: '柱状图',
      color1: '',
      activeNames: [], // 展开的组,
      type: 'pie'
    };
  },
  props: ['option', 'data'],
  computed: {
    // 计算
  },
  methods: {
    dataChange() {
      let that = this;
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
      // 清空series
      that.seriesOption.option.series = seriesPie(rows,queryNameKeyX, queryNameKeyY, seriesDefault);
      // // if (query.categoryColumns.length) {
      // if (queryNameKeyX.length) {
      //   // 一个维度一个数值
      //   let copy = JSON.parse(JSON.stringify(seriesDefault));
      //   let data = [];
      //   for (let i = 0; i < rows.length; i++) {
      //     data.push({
      //       name: rows[i][queryNameKeyX[0]],
      //       value: rows[i][queryNameKeyY[0]]
      //     });
      //   }
      //   that.seriesOption.option.series.push({
      //     data: data,
      //     type: that.type,
      //     itemStyle: copy.itemStyle,
      //     radius: copy.radius
      //   });
      // } else {
      //   // 0个维度多个数值，，，多个数值相加
      //   if (queryNameKeyY.length > 1) {
      //     // 多个数值
      //     let copy = JSON.parse(JSON.stringify(seriesDefault));
      //     let data = [];
      //     for (let i = 0; i < queryNameKeyY.length; i++) {
      //       data.push({
      //         value: rows[0][queryNameKeyY[i]],
      //         name: queryNameKeyY[i]
      //       });
      //     }
      //     that.seriesOption.option.series.push({
      //       data: data,
      //       type: that.type,
      //       itemStyle: copy.itemStyle,
      //       radius: copy.radius
      //     });
      //   }
      // }
      this.$emit('getSeries', that.seriesOption.option);
    }
  },
  watch: {
    seriesOption: {
      handler: function(newVal, oldVal) {
        this.$emit('getSeries', newVal.option);
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