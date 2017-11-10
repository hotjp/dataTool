<template>
    <div id="chartEditor" class="full">
        
        <el-row class="full">
            <el-col class="full" :span="4">
                <div class="grid-content full">
                  当前表：{{charts.tableName}} <br>
                  字段：
                  日期单独做

                </div>
                
            </el-col>
            <el-col class="full" :span="12">
                <div class="grid-content full">
                      <IEcharts style="width:400px;height:400px" :resizable="chartOptions.resizable" :option="chartOptions.option" :loading="chartOptions.loading" @ready="onChartReady"></IEcharts>
                </div>
            </el-col>
            <el-col class="full" :span="8">
                <div class="grid-content full">
                  <input type="text" v-model="charts.chartStyles.layout.title.text" placeholder="图表标题">
                  <ul v-for="(colors,index) in seriesColors" :key="index">
                    <li>
                      <a @click="onClickSeriesColors(index)" href="javascript:;">{{colors.name}}</a>
                    </li>
                  </ul>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
// import chartUI from '../../assets/js/chartUI';
import IEcharts from 'vue-echarts-v3/src/full.vue';
export default {
  mounted() {
  },
  components: {
    IEcharts
  },
  data() {
    return {
      // 系列风格
      seriesColors: [
        {
          name: '酷黑',
          value: ['#000', '#333', '#666']
        },
        {
          name: '酷红',
          value: ['red', 'pink', 'lightred']
        }
      ],
      charts: {
        tableName: '当前表名',
        type: 'bar',
        loading: true,
        resizable: false,
        chartStyles: {
          series: {
            color: ['#000', '#333', '#666']
          },
          layout: {
            title: {
              text: 'ECharts Hello World'
            },
            tooltip: {}
          }
        },
        queryInfo: {},
        dataTable: {}
      },
      // 图表参数，由charts数据computed出来
      // chartOptions: {
      //   loading: true,
      //   resizable: true,
      //   type: 'bar',
      //   option: {
      //     // chartStyles.series
      //     color: ['#000', '#333', '#666'],
      //     // chartStyles.layout
      //     title: {
      //       text: 'ECharts Hello World'
      //     },
      //     tooltip: {},
      //     // 用dataTable组织这块数据
      //     xAxis: {
      //       data: [
      //         'Shirt',
      //         'Sweater',
      //         'Chiffon Shirt',
      //         'Pants',
      //         'High Heels',
      //         'Socks'
      //       ]
      //     },
      //     yAxis: {},
      //     series: [
      //       {
      //         name: 'Sales',
      //         type: 'bar',
      //         data: [5, 20, 36, 10, 10, 20]
      //       },
      //       {
      //         name: 'Sales1',
      //         type: 'bar',
      //         data: [5, 20, 36, 10, 10, 20]
      //       }
      //     ]
      //   }
      // },
      pageName: '图表编辑'
    };
  },
  computed: {
    // 计算图表属性
    chartOptions() {
      // `this` 指向 vm 实例
      window.vm = this;
      let that = this,
        charts = that.charts;
      let options = {
        loading: (() => charts.loading)(),
        type: (() => charts.type)(),
        resizable: (() => charts.resizable)(),
        option: (() => Object.assign({}, charts.chartStyles.series, charts.chartStyles.layout, {
          xAxis: {
            data: [
              'Shirt',
              'Sweater',
              'Chiffon Shirt',
              'Pants',
              'High Heels',
              'Socks'
            ]
          },
          yAxis: {},
          series: [
            {
              name: 'Sales',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            },
            {
              name: 'Sales1',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }
          ]
        }))()
      };
      return options;
    }
  },
  methods: {
    // IEcharts组件会返回实例
    onChartReady(instance) {
      this.charts.loading = !this.charts.loading;
    },
    // 通过索引进行系列颜色赋值
    onClickSeriesColors(index) {
      this.charts.chartStyles.series.color = this.seriesColors[index].value;
    }
  }
};
</script>
<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>