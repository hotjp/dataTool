<template>
  <div class="yaxis">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="坐标Y轴" name="1">
        <div>
          <div>
            <el-checkbox v-model="yaxis.show">显示坐标轴</el-checkbox>
          </div>
          <div class="fix pl20">
            <el-dropdown @command="lineType">
              <span class="el-dropdown-link">
                {{yaxis.axisLine.lineStyle.type}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="solid">solid</el-dropdown-item>
                <el-dropdown-item command="dashed">dashed</el-dropdown-item>
                <el-dropdown-item command="dotted">dotted</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="lineWidth">
              <span class="el-dropdown-link">
                {{yaxis.axisLine.lineStyle.width}}
                <i class="el-icon-arrow-down el-icon--right"></i>
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
              <el-color-picker v-model="yaxis.axisLine.lineStyle.color"></el-color-picker>
            </div>
          </div>
        </div>
        <div>
          <div>
            <el-checkbox v-model="yaxis.axisLabel.show">显示标签</el-checkbox>
          </div>
          <div class="fix pl20">
            <el-dropdown @command="linefontFamily">
              <span class="el-dropdown-link">
                <span class="font_family_menu">
                  {{yaxis.axisLabel.fontFamily}}
                </span>

                <i class="el-icon-arrow-down el-icon--right"></i>
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
                {{yaxis.axisLabel.fontSize}}
                <i class="el-icon-arrow-down el-icon--right"></i>
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
            <div class="color_block ">
              <el-color-picker v-model="yaxis.axisLabel.color"></el-color-picker>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script type="text/babel">
export default {
  data: () => ({
    activeNames: ['1'],
    yaxis: {
      show: true,
      axisLine: {
        show: '',
        lineStyle: {
          type: '',
          width: '',
          color: ''
        }
      },
      axisLabel: {
        show: '',
        fontFamily: '',
        fontSize: '',
        color: ''
      }
    }
  }),
  props: ['setYaxis'],
  mounted() {
    let that = this;
    // 初始化页面数据
    Object.assign(that.yaxis, that.setYaxis);
  },
  methods: {
    lineType(command) {
      this.yaxis.axisLine.lineStyle.type = command;
    },
    lineWidth(command) {
      this.yaxis.axisLine.lineStyle.width = command;
    },
    linefontFamily(command) {
      this.yaxis.axisLabel.fontFamily = command;
    },
    linefontSize(command) {
      this.yaxis.axisLabel.fontSize = command;
    }
  },
  watch: {
    yaxis: {
      handler: function (val, oldval) {
        this.$emit('yaxisOptions', {
          option: {
            yAxis: val
          }
        });
      },
      deep: true
    },
    setYaxis: {
      handler: function (val, oldval) {
        Object.assign(this.yaxis, this.setYaxis);
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.el-dropdown,
.color_block {
  float: left;
  height: 24px;
  line-height: 24px;
}
.el-dropdown-item {
  height: 24px;
  line-height: 24px;
}
.el-dropdown {
  margin-right: 10px;
}
.el-dropdown-menu {
  margin-top: -3px;
}
.pl20 {
  padding-left: 20px;
}
.chart_right .el-color-picker {
  margin-top: -4px;
}
.el-color-picker__trigger {
  border-radius: 0px;
}
.chart_right .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0467e4;
}
.chart_right .el-checkbox__input.is-checked .el-checkbox__inner,
.chart_right .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #3582e3;
  border: none;
}
.font_family_menu {
  display: inline-block;
  max-width: 70px;
  overflow: hidden;
  height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

