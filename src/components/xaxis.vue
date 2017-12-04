<template>
  <div class="xaxis">
    <el-collapse>
      <el-collapse-item title="坐标X轴" name="xaxis">
        <div>
          <div><el-checkbox v-model="xaxis.axisLine.show">显示坐标轴</el-checkbox></div>
          <el-dropdown @command="lineType">
            <span class="el-dropdown-link">
              {{xaxis.axisLine.lineStyle.type}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="solid">solid</el-dropdown-item>
              <el-dropdown-item command="dashed">dashed</el-dropdown-item>
              <el-dropdown-item command="dotted">dotted</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="lineWidth">
            <span class="el-dropdown-link">
              {{xaxis.axisLine.lineStyle.width}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">1</el-dropdown-item>
              <el-dropdown-item command="2">2</el-dropdown-item>
              <el-dropdown-item command="3">3</el-dropdown-item>
              <el-dropdown-item command="4">4</el-dropdown-item>
              <el-dropdown-item command="5">5</el-dropdown-item>
              <el-dropdown-item command="6">6</el-dropdown-item>
              <el-dropdown-item command="7">7</el-dropdown-item>
              <el-dropdown-item command="8">8</el-dropdown-item>
              <el-dropdown-item command="9">9</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="color_block">
            <el-color-picker v-model="xaxis.axisLine.lineStyle.color"></el-color-picker>
          </div>
        </div>
        <div>
          <div><el-checkbox v-model="xaxis.axisLabel.show">显示标签</el-checkbox></div>
          <el-dropdown @command="linefontFamily">
            <span class="el-dropdown-link">
              {{xaxis.axisLabel.fontFamily}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="sans-serif">sans-serif</el-dropdown-item>
              <el-dropdown-item command="serif">serif</el-dropdown-item>
              <el-dropdown-item command="monospace">monospace</el-dropdown-item>
              <el-dropdown-item command="Arial">Arial</el-dropdown-item>
              <el-dropdown-item command="Courier New">Courier New</el-dropdown-item>
              <el-dropdown-item command="Microsoft YaHei">Microsoft YaHei</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="linefontSize">
            <span class="el-dropdown-link">
              {{xaxis.axisLabel.fontSize}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="10">10px</el-dropdown-item>
              <el-dropdown-item command="11">11px</el-dropdown-item>
              <el-dropdown-item command="12">12px</el-dropdown-item>
              <el-dropdown-item command="13">13px</el-dropdown-item>
              <el-dropdown-item command="14">14px</el-dropdown-item>
              <el-dropdown-item command="15">15px</el-dropdown-item>
              <el-dropdown-item command="16">16px</el-dropdown-item>
              <el-dropdown-item command="18">18px</el-dropdown-item>
              <el-dropdown-item command="20">20px</el-dropdown-item>
              <el-dropdown-item command="24">24px</el-dropdown-item>
              <el-dropdown-item command="32">32px</el-dropdown-item>
              <el-dropdown-item command="36">36px</el-dropdown-item>
              <el-dropdown-item command="48">48px</el-dropdown-item>
              <el-dropdown-item command="64">64px</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="color_block">
            <el-color-picker v-model="xaxis.axisLabel.color"></el-color-picker>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script type="text/babel">
export default {
  data: () => ({
    xaxis:{
      axisLine:{
        show:'',
        lineStyle:{
          type:'',
          width:'',
          color:''
        }
      },
      axisLabel:{
        show:'',
        fontFamily:'',
        fontSize:'',
        color:''
      }
    }
  }),
  props:['setXaxis'],
  mounted(){
    let that=this;
    // 初始化页面数据
    Object.assign(that.xaxis,that.setXaxis);
  },
  methods: {
    lineType(command) {
      this.xaxis.axisLine.lineStyle.type=command;
    },
    lineWidth(command){
      this.xaxis.axisLine.lineStyle.width=command;
    },
    linefontFamily(command){
      this.xaxis.axisLabel.fontFamily=command;
    },
    linefontSize(command){
      this.xaxis.axisLabel.fontSize=command;
    }
  },
  watch:{
    xaxis:{
      handler:function(val,oldval){  
        this.$emit('xaxisOptions',val);
      },
      deep:true
    }
  }
};
</script>
<style scoped>
.color_block{
  display: inline-block;
}
</style>

