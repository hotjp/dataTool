<template>
<el-collapse v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="饼图" name="1">
    <div class="comp_group fix">
      半径（百分比）：
      <el-slider v-model="radius" @change="radiusChange"></el-slider>
    </div>
  </el-collapse-item>
  
</el-collapse>
</template>

<script>
import seriesDefault from '../../vendor/seriesPie.json';
import '../../vendor/jsVendor/seriesPie.js';

export default {
  created() {
    this.dataChange();
  },
  mounted() {
    let that = this;
    (() => Object.assign(that.chartData, that.data))();
    if (that.option.series) {
      if (
        that.option.series[0].radius &&
        'string' == typeof that.option.series[0].radius
      ) {
        that.radius = parseInt(that.option.series[0].radius.split('%')[0]);
      } else {
        that.radius = parseInt(seriesDefault.radius.split('%')[0]);
      }
    }
  },
  data: () => ({
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
    // 默认配置项展开
    activeNames: ['1'],
    // 图表类型
    type: 'pie',
    pageName: '饼图',
    // 半径
    radius: null
  }),
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
      if (this.option.series) {
        for (let i = 0; i < this.option.series.length; i++) {
          this.option.series[i].radius = this.radius
            ? this.radius + '%'
            : seriesDefault.radius;
        }
      }
      that.seriesOption.option.series = seriesPie(
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
      this.$emit('getSeries', that.seriesOption.option);
    },
    // 半径调整
    radiusChange(data) {
      this.radius = data;
      for (let i = 0; i < this.seriesOption.option.series.length; i++) {
        this.seriesOption.option.series[i].radius = this.radius + '%';
      }
      this.seriesOption.option = Object.assign({}, this.seriesOption.option);
      this.$emit('getSeries', this.seriesOption.option);
    }
  },
  props: ['option', 'data']
};
</script>