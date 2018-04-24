<template>
  <div class="echarts" v-bind:class="{hideTable:hideTable}">
    <!-- <form action onsubmit="return false"> -->
      <div class="switch">
        <el-switch v-model="switchNull" active-color="#13ce66" inactive-color="#888" active-text="显示空值" inactive-text="不显示空值" :change="nullTest()" ></el-switch>
      </div>
      <el-table border style="width: 100%" height="100%" :data="tableData.rows" :row-class-name="addClass" :span-method="add">
          <el-table-column v-for="(item,index) in tableData.columns" :key="index" :prop="item.name" :label="item.source.text" ></el-table-column>
      </el-table>
    <!-- </form> -->
  </div>
</template>
<script type="text/babel">
import axios from 'axios';

export default {
  mounted() {
    this.init();
  },
  data: () => ({
    // 页面控制
    // switch的左右切换标识
    switchNull: true,
    // 类切换的标识
    hideTable: false,
    // 数据流
    // 初始数据
    chartData: {
      data: {
        columns: [],
        rows: []
      }
    },
    // 合并相同数据
    order: []
  }),
  computed: {
    //null值的format 为null时 处理成'-'
    tableData: function() {
      let chartData = this.chartData,
        prop = {
          columns: (() => chartData.data.columns)(),
          rows: (() => {
            let row = chartData.data.rows;
            for (let i = 0; i < row.length; i++) {
              for (let j in row[i]) {
                if (row[i][j] == null) {
                  row[i][j] = '-';
                  row[i]['null'] = 1;
                }
              }
            }
            return row;
          })()
        };
      return prop;
    }
  },
  watch: {
    myMessage: {
      handler: function(val, oldval) {
        this.init();
      },
      deep: true
    }
  },
  methods: {
    // swithch左右切换事件
    nullTest: function() {
      if (this.switchNull) {
        this.hideTable = false;
      } else {
        this.hideTable = true;
      }
    },
    // 有值为null的行 加上nullClass这个类
    addClass(row, index) {
      if (row.row.null) {
        return 'nullClass';
      }
    },
    // 行列合并
    add({ row, column, rowIndex, columnIndex }) {
      for (var i = 0; i < this.order.length; i++) {
        if (this.order[i].length) {
          if (columnIndex == i) {
            if (this.order[i].length) {
              for (var j = 0; j < this.order[i].length; j++) {
                if (rowIndex == this.order[i][j].spc) {
                  if (this.order[i][j].rowspan != 0) {
                    return {
                      rowspan: this.order[i][j].rowspan,
                      colspan: 1
                    };
                  } else {
                    return {
                      rowspan: 0,
                      colspan: 0
                    };
                  }
                }
              }
            }
          }
        }
      }
    },

    init() {
      let that = this;
      if(this.myMessage){ 
        Object.assign(this.chartData.data, this.myMessage.data);
      }
      // 合并数据;
      let data = this.chartData.data;
      let length = data.columns.length;
      let columns = [];
      var num = [];
      var xData = this.order;
      var flag = [];
      for (let i = 0; i < length; i++) {
        columns.push(data.columns[i].name);
        xData[i] = [];
        flag[i] = 'a';
        num[i] = 1;
      }
      var tableFormat = {
        column: function() {
          for (var i = 0; i < data.rows.length; i++) {
            tableFormat.row(i);
          }
        },
        row: function(i) {
          for (var j = 0; j < data.columns.length; j++) {
            if (data.rows[i][data.columns[j].name] == '') {
              break;
            }
            if (i + 1 < data.rows.length) {
              if (
                data.rows[i][data.columns[j].name] ==
                data.rows[i + 1][data.columns[j].name]
              ) {
                xData[j].push({});
                let arr = xData[j][xData[j].length - 1];
                arr['spc'] = i;
                if (typeof flag[j] == 'string') {
                  flag[j] = xData[j].length - 1;
                  let arr = xData[j][xData[j].length - 1];
                  arr['rowspan'] = num[j]++;
                  arr['spc'] = i;
                } else {
                  xData[j][flag[j]]['rowspan'] = num[j]++;
                  let arr = xData[j][xData[j].length - 1];
                  arr['rowspan'] = 0;
                }
              } else {
                if (typeof flag[j] != 'string') {
                  xData[j][flag[j]]['rowspan'] = num[j]++;
                  xData[j].push({});
                  let arr = xData[j][xData[j].length - 1];
                  flag[j] = 'a';
                  num[j] = 1;
                  arr['spc'] = i;
                  arr['rowspan'] = 0;
                } else {
                  break;
                  // if(xData[j].length){
                  //   let arr=xData[j][xData[j].length-1];
                  //   arr['rowspan']=num[j]++;
                  //   xData[j].push({});
                  //   arr=xData[j][xData[j].length-1];
                  //   arr['rowspan']=0;
                  // }
                }
              }
            } else {
              if (typeof flag[j] != 'string') {
                xData[j][flag[j]]['rowspan'] = num[j]++;
                xData[j].push({});
                let arr = xData[j][xData[j].length - 1];
                flag[j] = 'a';
                num[j] = 1;
                arr['spc'] = i;
                arr['rowspan'] = 0;
              }
            }
          }
        }
      };
      tableFormat.column();
    }
  },
  props: ['myMessage']  
};
</script>
<style>
/* .echarts{
  width:721px;
} */
.hideTable .nullClass {
  display: none;
}
.switch {
  height: 50px;
}
.el-table {
  height: calc(100% - 50px);
}
</style>
