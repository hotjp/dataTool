<template>
<el-collapse v-model="activeNames" id="chartsComponents">
  <el-collapse-item title="漏斗图" name="1">
    <div class="comp_group fix">
      
    </div>
  </el-collapse-item>
  
</el-collapse>
</template>

<script>
import seriesDefault from '../../vendor/seriesFunnel.json';
import '../../vendor/jsVendor/seriesFunnel.js';

export default {
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
        xAxis: {},
        yAxis: {}
      }
    },
    // 数据
    chartData: {},
    // 默认配置项展开
    activeNames: ['1'],
    // 图表类型
    type: 'funnel',
    pageName: '漏斗图'
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
      that.seriesOption.option.series = seriesFunnel(
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
    }
  },
  props: ['option', 'data']
};
</script>
<style>

</style>