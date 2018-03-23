<template>
  <div class="series series_styles">
    <el-collapse v-model="activeNames">
        <el-collapse-item title="序列风格" name="1">
          <ul v-bind:class="[isAllStyleShow ?'show':'']" >
            <li v-for="(colors,index) in seriesColors" :key="index" v-bind:class="[colors.active==0?'active':'',colors.show==0?'show':'']">
              <a @click="onClickSeriesColors(index)" href="javascript:;"  class="ss_item fix l">
                <div class="l block" v-for="(color,index) in colors.value" v-bind:style="{background:color}"></div>
              </a>
              <i class="arr l el-icon-arrow-down"  @click="toggleSeriesStyle()" ></i>
            </li>
          </ul>    
        </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script type="text/babel">
export default{
  data:()=>({
    // 默认配置项展开
    activeNames:['1'],
    // 系列风格    
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
        active:0,
        show:0
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
        active:1,
        show:1
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
        active:1,
        show:1
      },
      {
        name: 'walden',
        value: [
          '#3fb1e3',
          '#6be6c1',
          '#626c91',
          '#a0a7e6',
          '#c4ebad',
          '#96dee8'
        ],
        active:1,
        show:1        
      }
    ],
    // 是否展开所有序列风格
    isAllStyleShow:false
  }),
  watch:{
    charts: {
      handler: function (val, oldval) {
        let that = this;
        // 匹配系列风格
        // 应用name匹配，但旧数据没有保存，添加对比value
        if(that.charts.option.colorName){
          for(let i=0;i<that.seriesColors.length;i++){
            if(that.charts.option.colorName == that.seriesColors[i].name){
              that.seriesColors[i].active = 0;
            }else{
              that.seriesColors[i].active = 1;
            }
          }
        }else{
          let optionColor = JSON.stringify(that.charts.option.color);
          for(let i=0;i<that.seriesColors.length;i++){
            if(optionColor == JSON.stringify(that.seriesColors[i].value)){
              that.seriesColors[i].active = 0;
            }else{
              that.seriesColors[i].active = 1;
            }
          }
        }
      },
      deep: true
    }
  },
  methods:{
    // 通过索引进行系列颜色赋值
    onClickSeriesColors(index) {
      this.isAllStyleShow = false;
      this.$emit('seriesStyles',this.seriesColors[index]);
      for(let i = 0;i<this.seriesColors.length;i++){
        if(i==index){
          this.seriesColors[i]['active']=0;
          this.seriesColors[i]['show']=0;
        }else{
          this.seriesColors[i]['active']=1;
          this.seriesColors[i]['show']=1;
        }
      }
      
    },
    
    toggleSeriesStyle(){
      this.isAllStyleShow = !this.isAllStyleShow;
    
      if(this.isAllStyleShow){
        for(let i = 0;i<this.seriesColors.length;i++){
            this.seriesColors[i]['show']=0;
        }
      }else{
        for(let i = 0;i<this.seriesColors.length;i++){
          if(this.seriesColors[i]['active']==0){
            this.seriesColors[i]['show']=0;
          }else{
            this.seriesColors[i]['show']=1;
          }
        }
      }

    }
  },
  props: ['charts']  
};
</script>
