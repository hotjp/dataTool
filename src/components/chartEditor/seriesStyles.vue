<template>
  <div class="series series_styles">
    <el-collapse v-model="activeNames">
        <el-collapse-item title="序列风格" name="1">
          <ul>
            <li v-for="(colors,index) in seriesColors" :key="index">
              <a @click="onClickSeriesColors(index)" href="javascript:;" v-bind:class="[colors.active==0?'active':'']" class="ss_item fix ">
                <div class="l block" v-for="(color,index) in colors.value" v-bind:style="{background:color}"></div>
              </a>
            </li>
          </ul>    
        </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script type="text/babel">
export default{
  data:()=>({
    // 系列风格
    activeNames:['1'],
    seriesColors: [
      {
        name: 'vintage',
        value: [
          '#d87c7c',
          '#919e8b',
          '#d7ab82',
          '#6e7074',
          '#61a0a8',
          '#efa18d',
          '#787464',
          '#cc7e63',
          '#724e58',
          '#4b565b'
        ],
        active:0
      },
      {
        name: 'westeros',
        value: [
          '#516b91',
          '#59c4e6',
          '#edafda',
          '#93b7e3',
          '#a5e7f0',
          '#cbb0e3'
        ],
        active:1
      },
      {
        name: 'essos',
        value: [
          '#893448',
          '#d95850',
          '#eb8146',
          '#ffb248',
          '#f2d643',
          '#ebdba4'
        ],
        active:1
      }
    ]
  }),
  methods:{
    // 通过索引进行系列颜色赋值
    onClickSeriesColors(index) {
      this.$emit('seriesStyles',this.seriesColors[index].value);
      for(let i = 0;i<this.seriesColors.length;i++){
        if(i==index){
          this.seriesColors[i]['active']=0;
        }else{
          this.seriesColors[i]['active']=1;
        }
      }
      
    }
  },
  mounted(){

  }
};
</script>
<style>
.series_styles .ss_item{
  display: block;
  width:190px;
  height: 50px;
  overflow: hidden;
  padding:8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 5px;
  background: #fff;
}
.series_styles .block{
  width: 30px;
  height:30px;
  margin:0 2px 10px 2px;
}
.series_styles .active{
  background: #ddd;
  border-color: #8ea7e4;
}
</style>
