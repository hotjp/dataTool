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
    props:['myMessage'],
    mounted() {
      let that=this;
      Object.assign(this.chartData.data,this.myMessage.data); 
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
              return row;
            })()
          };
        return prop;
      } 
    },
    methods:{
      // swithch左右切换事件
      nullTest:function(){
        if(this.switchNull){
          this.hideTable=false;          
        }else{
          this.hideTable=true;
        }
      },
      // 有值为null的行 加上nullClass这个类
      addClass(row,index){
        if(row.row.null){
          return 'nullClass';
        }
      }
    }
  };

</script>
<style scoped>
/* .echarts{
  width:721px;
} */
.hideTable .nullClass{
  display:none;
}
.switch{
  margin-bottom: 30px;
}
</style>
