<template>
  <el-dialog class="summary_filter" title="汇总数值筛选器" :visible.sync="option.summaryFilter" width="30%">
    <form action onsubmit="return false">
      <el-checkbox v-model="option.useFilter">使用下方筛选条件</el-checkbox>
      <br>
      <el-select class="l filter_select" v-model="option.filter.op" placeholder="请选择">
        <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <input v-if="filterValueFlag==1" type="number" class="filter_value" @input="input(0,$event)" placeholder="请输入数值">
      <div class="l fix interval_input_div" v-if="filterValueFlag==2">
        <input class="interval_input" type="number" @input="input(0,$event)" placeholder="请输入数值">~
        <input class="interval_input" type="number" @input="input(1,$event)" placeholder="请输入数值">
      </div>
    </form>
    <span slot="footer" class="dialog-footer">
      <el-button class="btn-confirm" type="primary" @click="summaryFilter(1)">确 定</el-button>
      <el-button class="btn-cancel" @click="summaryFilter(0)">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/babel">
export default {
  mounted() {
  },
  data: () => ({
    // 汇总数值筛选器 数值输入旗帜
    filterValueFlag: 1,
    filterOptions: [{
      value: 'eq',
      label: '等于'
    }, {
      value: 'ne',
      label: '不等于'
    }, {
      value: 'lt',
      label: '小于'
    }, {
      value: 'le',
      label: '小于等于'
    }, {
      value: 'gt',
      label: '大于'
    },
    {
      value: 'between',
      label: '区间'
    }],
    option:{
      summaryFilter: false,
      useFilter: false,
      index:0,
      filter:{
        conj:'and',
        op:'',
        name:'',
        values:[]
      }
    },
    resultOption:{
      summaryFilter: false,
      useFilter: false,
      index:0,
      filter:{
        conj:'and',
        op:'',
        name:'',
        values:[]
      }
    },
    getqueryInfo:{}
  }),
  watch: {
    'option.filter.op': function (val) {
      if (val == 'between') {
        this.filterValueFlag = 2;
      } else if (val == '不为空' || val == '为空') {
        this.filterValueFlag = 3;
      } else {
        this.filterValueFlag = 1;
      }
    },
    ScreenOption: {
      handler: function(val, oldval) {
        this.option=Object.assign({}, this.option, this.ScreenOption);
        this.option.filter=Object.assign({}, this.option.filter, this.getqueryInfo.valueColumns[this.option.index].filter);
      },
      deep: true
    },
    'option.summaryFilter':{
      handler:function(val,oldval){
        this.$emit('summaryFilter', this.option.summaryFilter);
      }
    },
    queryInfo:{
      handler:function(val,oldval){
        this.getqueryInfo=Object.assign({},this.getqueryInfo,val);
      }
    },
    filterValueFlag:{
      handler:function(val,oldval){
        console.log(val);
      }
    }
  },
  methods: {
    // 筛选主函数
    summaryFilter(e){
      if(e){
        this.option.filter.name=this.getqueryInfo.valueColumns[this.option.index].name;
        let res=Object.assign({},this.option.filter);
        for(var i=0;i<this.getqueryInfo.filters.length;i++){
          if(this.getqueryInfo.filters[i].name==this.getqueryInfo.valueColumns[this.option.index].name){
            this.getqueryInfo.filters[i]['op']=this.option.filter.op;
            res=Object.assign({});
            break;
          }
        }
        if(Object.keys(res).length){
          this.getqueryInfo.filters.push(res);
        }
        for(var j=0;j<this.getqueryInfo.valueColumns.length;j++){
          if(this.option.filter.name==this.getqueryInfo.valueColumns[j].name){
            this.getqueryInfo.valueColumns[j]['filter']=Object.assign(this.getqueryInfo.valueColumns[j]['filter'],this.option.filter);
          }
        }
        this.option.summaryFilter=false;
        console.log(this.getqueryInfo);
        this.$emit('YScreen', this.option);  
        this.$emit('getqueryInfo', this.getqueryInfo);  
      }
      this.option.summaryFilter=false;
    },
    // 输入input绑定
    input:function(e,val){
      this.option.filter.values[e]=val.target.value;
    }
  },
  props: ['ScreenOption','queryInfo'],
  
};
</script>
<style scoped>

</style>
