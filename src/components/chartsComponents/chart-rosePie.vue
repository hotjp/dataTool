<template>
<el-collapse v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="南丁格尔玫瑰图" name="1">
    <div class="comp_group fix">
      内径（百分比）：
      <el-slider v-model="radius[0]" @change="radiusInside"></el-slider>
      <br>
      外径（百分比）：
      <el-slider v-model="radius[1]" @change="radiusOutside"></el-slider>
    </div>
    <div class="comp_group fix">
      玫瑰图类型：
      <el-dropdown @command="selectRoseType">
        <span class="el-dropdown-link">
          <span class="rose_type_menu">{{roseType}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="area">area</el-dropdown-item>
          <el-dropdown-item command="radius">radius</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    
  </el-collapse-item>
  
</el-collapse>
</template>

<script>
import seriesDefault from '../../vendor/seriesRosePie.json';
import '../../vendor/jsVendor/seriesRosePie.js';

export default {
  created() {
    this.dataChange();
  },
  mounted() {
    let that = this;
    (() => Object.assign(that.chartData, that.data))();
    if (that.option.series) {
      if (that.option.series[0].roseType) {
        that.roseType = that.option.series[0].roseType;
      }
      if (that.option.series[0].radius instanceof Array) {
        that.radius = that.option.series[0].radius;
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
    // 数据
    chartData: {},
    // 默认配置项展开
    activeNames: ['1'],
    // 图表类型
    type: 'pie',
    pageName: '南丁格尔玫瑰图',
    // 玫瑰图类型
    roseType: seriesDefault.roseType,
    // 半径
    radius: seriesDefault.radius
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

      // series.data的数据
      if (this.option.series) {
        for (let i = 0; i < this.option.series.length; i++) {
          this.option.series[i].radius = this.radius
            ? this.radius
            : seriesDefault.radius;
        }
      }
      that.seriesOption.option.series = seriesRosePie(
        columns,
        rows,
        queryNameKeyX,
        queryNameKeyY,
        seriesDefault,
        that.option.series,
        true
      );

      that.$set(this.seriesOption.option, 'grid', seriesDefault.grid);
      this.$emit('getSeries', that.seriesOption.option);
    },
    // 切换玫瑰图种类
    selectRoseType(command) {
      this.roseType = command;
      for (let i = 0; i < this.seriesOption.option.series.length; i++) {
        this.seriesOption.option.series[i].roseType = this.roseType;
      }
      this.seriesOption.option = Object.assign({}, this.seriesOption.option);
      this.$emit('getSeries', this.seriesOption.option);
    },
    // 内径
    radiusInside(data) {
      this.radius[0] = data;
      for (let i = 0; i < this.seriesOption.option.series.length; i++) {
        this.seriesOption.option.series[i].radius = this.radius;
      }
      this.seriesOption.option = Object.assign({}, this.seriesOption.option);
      this.$emit('getSeries', this.seriesOption.option);
    },
    // 外径
    radiusOutside(data) {
      this.radius[1] = data;
      for (let i = 0; i < this.seriesOption.option.series.length; i++) {
        this.seriesOption.option.series[i].radius = this.radius;
      }
      this.seriesOption.option = Object.assign({}, this.seriesOption.option);
      this.$emit('getSeries', this.seriesOption.option);
    }
  },
  props: ['option', 'data']
};
</script>