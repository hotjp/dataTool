<template>
    <div id="chartEditor" class="full">
        <el-row class="full">
            <el-col class="full" :span="4">
                <div class="grid-content full">
                  当前表：{{charts.tableName}} <br>
                  字段：
                  日期单独做
                  <el-card>
                    <ul v-for="{item,index} in columns" :key="index" class="colums_list">
                      <li class="colums_item">
                        <i>{{item.type}}</i>
                        {{item.text}}
                        </li>  
                    </ul>
                  </el-card>
                </div>
            </el-col>
            <el-col class="full" :span="12">
                <div class="grid-content full">
                  <div class="query">
                    <div class="xAxis">
                      <ul v-for="{column,index} in queryInfo.categoryColumns" :key="index">
                        <li>
                          {{column.name}}
                          {{column.text}}
                          {{column.aggr}}
                        </li>
                      </ul>
                      <ul v-for="{column,index} in queryInfo.valueColumns" :key="index">
                        <li></li>
                      </ul>
                    </div>
                    <div class="yAxis"></div>
                  </div>
                  <IEcharts style="width:400px;height:400px" :resizable="chartOptions.resizable" :option="chartOptions.option" :loading="chartOptions.loading" @ready="onChartReady"></IEcharts>
                  <a @click="getChartData" href="javascript:;">点击使用query获取data</a>
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
import vars from '../../assets/js/vars';
import axios from 'axios';
import IEcharts from 'vue-echarts-v3/src/full.vue';
export default {
  mounted() {
    let that = this,
      params = that.$route.params;
    axios({
      url: 'dataviewInfo.do',
      baseURL: vars.api,
      data: {
        view: params.viewId
      }
    })
      .then(function (res) {
        var resData = res.data;
        if (resData.success) {
          // console.log(resData);
          that.columns = resData.data.columns;
        }
      })
      .catch(function (res) {
        console.log(res);
      });
  },
  components: {
    IEcharts
  },
  data() {
    return {
      // 当前报表数据列
      columns: [],
      // 当前查询
      queryInfo: {
        // xAxis
        categoryColumns: [],
        // yAxis
        valueColumns: [],
        filters: []
      },
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
        queryInfo: {
          // 数值列
          valueColumns: [{
            name: 'price', // 列名
            aggr: 'sum'    // 聚合方式(sum/min/max/avg)
          }, {
            name: 'price',
            aggr: 'min'
          }, {
            name: 'qty',
            aggr: 'sum'
          }],
          // 维度列
          // 日期型数据可以对数据进行粒度调整，分为提取字段(year/month/date/hour/minute/second/week/quarter)和按截断到时间(trunc_*)
          // 数值型数据可以按数值分布进行分区，并指定分区数量
          // 其他类型按字面值分组
          categoryColumns: [{
            name: 'date',          // 列名
            //          gran: "trunc_month",   // 粒度：按月
            //          gran: "trunc_date",    // 粒度：按日叠加
            //          gran: "quarter",       // 粒度：按季度叠加
            gran: 'trunc_quarter', // 粒度：按季度
            sort: 'asc'            // 排序
          }, {
            name: 'type'
          }],
          // 过滤条件
          // 表达式树，与千里马的表达式编辑器类似
          filters: [
            {
              conj: 'and',   // 条件关系，同级别条件的关系运算符应相同，第一个表达式的条件没有作用
              name: 'price',  // 列名
              op: 'gt',       // 操作符(gt/gte/lt/lte/eq/ne/in/not_in/between)
              values: [1]     // 目标值列表，数量根据操作符决定
            },
            {
              conj: 'and',
              name: 'qty',
              op: 'lt',
              values: [99999]
            },
            {
              conj: 'and',
              exprs: [{
                conj: 'or',
                name: 'type',
                op: 'eq',
                values: ['requirement']
              }, {
                conj: 'or',
                name: 'status',
                op: 'in',
                values: ['closed', 'done']
              }]
            }
          ]
        },
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
    },
    getChartData() {
      let that = this,
        params = that.$route.params;
      // 查询图表源 数据
      axios('query.do', {
        baseURL: vars.api,
        params: {
          view: params.viewId,
          queryInfo: JSON.stringify(that.queryInfo)
        }
      })
        .then(function (res) {
          var resData = res.data;
          if (resData.success) {
            console.log(resData);
            that.columns = resData.data.columns;
          }
        })
        .catch(function (res) {
          console.log(res);
        });

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