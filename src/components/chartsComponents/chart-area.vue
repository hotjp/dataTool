<template>
  <el-collapse v-model="activeNames" id="chartsComponents">
    <form action onsubmit="return false">
      <el-collapse-item title="面积图" name="1">
        <div class="comp_group fix">
          <div v-for="(item,index) in seriesOption.option.series" :key="index" class="colums_list">
            <div class="fix lh30">
              <colorPicker class="color_picker" :color.sync="item.itemStyle.normal.color" ></colorPicker>
              <p class="l item_name">{{item.name}}</p>
            </div>
            <div class="fix lh30">
              <colorPicker class="color_picker" :color.sync="item.areaStyle.normal.color.colorStops[0].color" ></colorPicker>
              <colorPicker class="color_picker" :color.sync="item.areaStyle.normal.color.colorStops[1].color" ></colorPicker>
              起止颜色
            </div>
          </div>
        </div>
        <div class="comp_group fix">
          <el-switch v-model="smooth" active-color="#5182E4" @change="smoothChange" inactive-color="#cccccc"></el-switch> 
          平滑曲线
        </div>
      </el-collapse-item>
    </form>
  </el-collapse>
</template>

<script>
import seriesDefault from '../../vendor/seriesArea.json';
import '../../vendor/jsVendor/seriesArea.js';

import colorPicker from '../chartEditor/propSelect/colorPicker.vue';

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
    if (that.option.series) {
      if (that.option.series[0].smooth) {
        that.smooth = that.option.series[0].smooth;
      }
    }
  },
  data: () => ({
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
    type: 'line',
    pageName: '面积图',
    // 是否平滑曲线
    smooth: false
  }),
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

  },
  methods: {
    // 平滑曲线
    smoothChange(data) {
      for (let i = 0; i < this.seriesOption.option.series.length; i++) {
        this.seriesOption.option.series[i].smooth = data;
      }
      this.seriesOption.option = Object.assign({}, this.seriesOption.option);
      this.$emit('getSeries', this.seriesOption.option);
    },
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

      newData.series = seriesArea(
        columns,
        rows,
        queryNameKeyX,
        queryNameKeyY,
        seriesDefault,
        that.option.series,
        true
      );

      that.$set(this.seriesOption.option, 'grid', seriesDefault.grid);
      that.$set(this.seriesOption.option, 'xAxis', newData.xAxis);
      that.$set(this.seriesOption.option, 'series', newData.series);
      that.$emit('getSeries', that.seriesOption.option);
    }
  },
  props: ['option', 'data']
};
</script>
<style>
.lh30 {
  line-height: 30px;
}
</style>