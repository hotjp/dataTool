<template>
  <div id="chartEditor" class="full">
    <el-row class="full">
      <el-col class="full" :span="4">
        <div class="grid-content full">
          当前表：{{charts.tableName}} <br> 字段： 日期单独做
          <el-card>
            <ul v-for="(item,index) in columns" :key="index" class="colums_list">
              <li class="colums_item">
                <i>{{item.type}}</i>
                {{item.text}}
                <a @click="onAddColumnClick(item)" href="javascript:;">添加到维度</a>
                <a @click="onAddValueClick(item)" href="javascript:;">添加到数值</a>
              </li>
            </ul>
          </el-card>
        </div>
      </el-col>
      <el-col class="full" :span="12">
        <div class="grid-content full">
          <div class="query">
            <div class="xAxis">
              维度
              <ul>
                <li v-for="(column,index) in queryInfo.categoryColumns" :key="index">
                  {{column.name}} {{column.text}}
                  <a @click="onDeleteColumnClick(column)" href="javascript:;">删除</a>
                </li>
              </ul>
              数值
              <ul>
                <li @click="onDeleteValueClick(value)" v-for="(value,index) in queryInfo.valueColumns" :key="index">
                  {{value.name}} {{value.text}}
                  <!--<a @click="onDeleteValueClick(column)" href="javascript:;">删除</a>-->
                  <a @click="onDeleteValueClick(value)" href="javascript:;">删除</a>
                </li>
              </ul>
            </div>
            <div class="yAxis"></div>
          </div>
          <IEcharts style="width:400px;height:400px" :resizable="charts.resizable" :option="charts.option" :loading="charts.loading" @ready="onChartReady"></IEcharts>
          <a @click="getChartData" href="javascript:;">点击使用query获取data并判断可用图表</a>
        </div>

      </el-col>
      <el-col class="full" :span="8">
        <div class="grid-content full">
          <input type="text" v-model="charts.option.title.text" placeholder="图表标题">
          <br>序列风格
          <ul v-for="(colors,index) in seriesColors" :key="index">
            <li>
              <a @click="onClickSeriesColors(index)" href="javascript:;">{{colors.name}}</a>
            </li>
          </ul>
          <br>图表类型
          <ul>
            <li v-for="(type,key) in chartTypes" :key="key" :class="type.allowUse? 'isAllow':''">
              <a @click="onClickType(key)" href="javascript:;">
                {{type.name}} ({{type.allowUse?'可用':'不可用'}})
              </a>
              <div v-for="(rule,index) in type.rules" :key="index">
                <i>{{rule.columns.text}} 维度</i><br>
                <i>{{rule.values.text}} 数值</i>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import chartUI from '../../assets/js/chartUI';
import chartTypes from '../../assets/js/chart_types';
import vars from '../../assets/js/vars';
import axios from 'axios';
import IEcharts from 'vue-echarts-v3/src/full.vue';
function evalConditional(first, condition, second) {
  if (arguments.length != 3) {
    console.error('参数不足');
    return false;
  }

  if (second == 'any') {
    second = first;
  }
  if (isNaN(first) || isNaN(second)) {
    console.error('数据包含非数字');
    return false;
  }
  return new Function('return ' + first + condition + second)();
}

export default {
  mounted() {
    let that = this,
      params = that.$route.params;
    axios({
      url: '/dataviewInfo.do',
      baseURL: vars.api,
      params: {
        view: params.viewId
      }
    })
      .then(function (res) {
        var resData = res.data;
        if (resData.success) {
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
      // 页面名称
      pageName: '图表编辑',
      // 现有图表类型
      chartTypes: chartTypes,
      // 当前报表数据列
      columns: [],
      // 当前查询
      queryInfo: {
        'valueColumns': [
          {
            'text': '价格',
            'name': 'price',
            'aggr': 'sum'
          },
          {
            'text': '价格',
            'name': 'price',
            'aggr': 'min'
          },
          {
            'text': '数量',
            'name': 'qty',
            'aggr': 'sum'
          }
        ],
        'categoryColumns': [
          {
            'text': '日期',
            'name': 'date',
            'gran': 'trunc_quarter',
            'sort': 'asc'
          },
          {
            'text': '类型',
            'name': 'type'
          }
        ],
        'filters': [
          {
            'conj': 'and',
            'name': 'price',
            'op': 'gt',
            'values': [
              1
            ]
          },
          {
            'conj': 'and',
            'name': 'qty',
            'op': 'lt',
            'values': [
              99999
            ]
          },
          {
            'conj': 'and',
            'exprs': [
              {
                'conj': 'or',
                'name': 'type',
                'op': 'eq',
                'values': [
                  'requirement'
                ]
              },
              {
                'conj': 'or',
                'name': 'status',
                'op': 'in',
                'values': [
                  'closed',
                  'done'
                ]
              }
            ]
          }
        ]
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
        option: {
          color: ['#000', '#333', '#666'],
          title: {
            text: 'ECharts Hello World'
          },
          tooltip: {},
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

        }

        //        queryInfo: {
        //          // 数值列
        //          valueColumns: [{
        //            name: 'price', // 列名
        //            aggr: 'sum'    // 聚合方式(sum/min/max/avg)
        //          }, {
        //            name: 'price',
        //            aggr: 'min'
        //          }, {
        //            name: 'qty',
        //            aggr: 'sum'
        //          }],
        //          // 维度列
        //          // 日期型数据可以对数据进行粒度调整，分为提取字段(year/month/date/hour/minute/second/week/quarter)和按截断到时间(trunc_*)
        //          // 数值型数据可以按数值分布进行分区，并指定分区数量
        //          // 其他类型按字面值分组
        //          categoryColumns: [{
        //            name: 'date',          // 列名
        //            //          gran: "trunc_month",   // 粒度：按月
        //            //          gran: "trunc_date",    // 粒度：按日叠加
        //            //          gran: "quarter",       // 粒度：按季度叠加
        //            gran: 'trunc_quarter', // 粒度：按季度
        //            sort: 'asc'            // 排序
        //          }, {
        //            name: 'type'
        //          }],
        //          // 过滤条件
        //          // 表达式树，与千里马的表达式编辑器类似
        //          filters: [
        //            {
        //              conj: 'and',   // 条件关系，同级别条件的关系运算符应相同，第一个表达式的条件没有作用
        //              name: 'price',  // 列名
        //              op: 'gt',       // 操作符(gt/gte/lt/lte/eq/ne/in/not_in/between)
        //              values: [1]     // 目标值列表，数量根据操作符决定
        //            },
        //            {
        //              conj: 'and',
        //              name: 'qty',
        //              op: 'lt',
        //              values: [99999]
        //            },
        //            {
        //              conj: 'and',
        //              exprs: [{
        //                conj: 'or',
        //                name: 'type',
        //                op: 'eq',
        //                values: ['requirement']
        //              }, {
        //                conj: 'or',
        //                name: 'status',
        //                op: 'in',
        //                values: ['closed', 'done']
        //              }]
        //            }
        //          ]
        //        }
      }
    };
  },
  methods: {
    // IEcharts组件会返回实例
    onChartReady(instance) {
      this.charts.loading = !this.charts.loading;
    },
    // 通过索引进行系列颜色赋值
    onClickSeriesColors(index) {
      this.charts.option.color = this.seriesColors[index].value;
      //      this.charts.chartStyles.series.color = this.seriesColors[index].value;
    },
    // 点击切换图表
    onClickType(typeName) {
      // TODO:图表的点击切换
      console.log(typeName + '被点击');
    },
    // 删除某一维度,操作queryInfo.categoryColumns
    // TODO:考虑删除维度和删除数值是否需要合并
    onDeleteColumnClick(column) {
      let index = this.queryInfo.categoryColumns.indexOf(column);
      if (0 <= index) {
        this.queryInfo.categoryColumns.splice(index, 1);
      }
    },
    // 删除某一数值,操作queryInfo.categoryColumns
    onDeleteValueClick(column) {
      let index = this.queryInfo.valueColumns.indexOf(column);
      if (0 <= index) {
        this.queryInfo.valueColumns.splice(index, 1);
      }
    },
    // 根据数据确定哪些图表可用
    checkChartType() {
      let that = this,
        queryInfo = that.queryInfo,
        chartTypes = that.chartTypes;
      const columnNum = queryInfo.categoryColumns.length,
        valueNum = queryInfo.valueColumns.length;
      // 循环所有类型
      for (const key in chartTypes) {
        if (chartTypes.hasOwnProperty(key)) {
          const type = chartTypes[key],
            rules = type.rules;
          // 禁用全部
          type.allowUse = false;
          // 循环条件
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            // 如果构建条件语句成功则启用
            if (evalConditional(columnNum, rule.columns.rule, rule.columns.num) && evalConditional(valueNum, rule.values.rule, rule.values.num)) {
              type.allowUse = true;
            }
          }
        }
      }
    },
    getChartData() {
      let that = this,
        params = that.$route.params;
      // 查询图表源 数据
      axios({
        url: '/query.do',
        baseURL: vars.api,
        params: {
          view: '',
          query: JSON.stringify(that.queryInfo)
        },
        data: {}
      })
        .then(function (res) {
          let resData = res.data;
          if (resData.success) {
            console.log(resData);
            that.chartData = resData.data;
            that.checkChartType();
          }
        })
        .catch(function (res) {
          console.log(res);
        });
    },
    //通用填值
    fetchVal(item) {
      // TODO: 分类型聚合
      let temVal = {};
      if (item.type === 'String') {
        temVal['text'] = item.text;
        temVal['name'] = item.name;
      } else if (item.type === 'Date') {
        temVal['text'] = item.text;
        temVal['name'] = item.name;
        temVal['gran'] = item.gran ? item.gran : 'trunc_quarter';
        temVal['sort'] = item.sort ? item.sort : 'asc';
      } else if (item.type === 'Number') {
        temVal['text'] = item.text;
        temVal['name'] = item.name;
        temVal['aggr'] = item.aggr ? item.aggr : 'sum';
      } else {
        return false;
      }
      return temVal;
    },
    //添加到维度
    onAddColumnClick(item) {
      let res = this.fetchVal(item);
      if (res) {
        this.queryInfo.categoryColumns.push(res);
      }
    },
    //添加到数值
    onAddValueClick(item) {
      let res = this.fetchVal(item);
      if (res) {
        this.queryInfo.valueColumns.push(res);
      }
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