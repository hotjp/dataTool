<template>
  <div class="echarts" v-bind:class="{hideTable:hideTable}">
    <el-switch v-model="switchNull" active-color="#13ce66" inactive-color="#888" active-text="显示空值"
  inactive-text="不显示空值" :change="nullTest()" class="switch"></el-switch>
    <el-table border style="width: 100%" :data="tableData.rows" :row-class-name="addClass">
        <el-table-column v-for="(item,index) in tableData.columns" :key="index" :prop="item.name" :label="item.source.text" width="180"></el-table-column>
    </el-table>
  </div>
</template>
<script type="text/babel">
  import axios from 'axios';
  export default {
    data: () => ({
      // 初始数据
      chartData:{
        data:{
          columns:[],
          rows:[]
        }
      },
      // switch的左右切换标识
      switchNull:true,
      // 类切换的标识
      hideTable:false
    }),
    mounted() {
      let that=this;
      // 所需参数
      let queryInfo = {
        // 数值列
        valueColumns: [{
          name: "price", // 列名
          aggr: "sum"    // 聚合方式(sum/min/max/avg)
        }, {
          name: "price",
          aggr: "min"
        }, {
          name: "qty",
          aggr: "sum"
        }],
        categoryColumns: [{
          name: "date",          // 列名
          gran: "trunc_quarter", // 粒度：按季度
          sort: "asc"            // 排序
        }, {
          name: "type"
        }],
        filters: [
          {
            conj: "and",   // 条件关系，同级别条件的关系运算符应相同，第一个表达式的条件没有作用
            name: "price",  // 列名
            op: "gt",       // 操作符(gt/gte/lt/lte/eq/ne/in/not_in/between)
            values: [1]     // 目标值列表，数量根据操作符决定
          },
          {
            conj: "and",
            name: "qty",
            op: "lt",
            values: [99999]
          },
          {
            conj: "and",
            exprs: [{
              conj: "or",
              name: "type",
              op: "eq",
              values: ["requirement"]
            }, {
              conj: "or",
              name: "status",
              op: "in",
              values: ["closed", "done"]
            }]
          }
        ]
      };
      // 获取数据chartData
      axios({
        method:'get',
        url:'http://119.180.98.134:8880/dataviz/api/query.do',
        params:{
          view: '',
          query: JSON.stringify(queryInfo)
        },
        data:{}
      })
      .then(function (response) {
        Object.assign(that.chartData,response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      }); 
    },
    computed: {
      //null值的format 为null时 处理成'-'
      tableData:function(){
        let chartData=this.chartData,
        prop={
          columns:(()=>chartData.data.columns)(),
          rows:(()=>{
            let row=chartData.data.rows;
              for(let i=0;i<row.length;i++){
                  for(let j in row[i]){
                    if(row[i][j]==null){
                      row[i][j]='-';
                      row[i]['null']=1;
                    }
                  }
              }
            return row
          })()
        }
        return prop
      } 
    },
    methods:{
      // swithch左右切换事件
      nullTest:function(){
        if(this.switchNull){
          this.hideTable=false          
        }else{
          this.hideTable=true
        }
      },
      // 有值为null的行 加上nullClass这个类
      addClass(row,index){
        if(row.row.null){
          return 'nullClass'
        }
      }
    }
  };

</script>
<style>
.echarts{
  width:721px;
}
.hideTable .nullClass{
  display:none;
}
.switch{
  margin-bottom: 30px;
}
</style>
