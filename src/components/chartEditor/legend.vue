<template>
  <div class="legend">
    <form action onsubmit="return false">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="图例设置" name="1">
          <div>
            <div>
              <el-checkbox v-model="legend.show">图例设置</el-checkbox>
            </div>
            <div class="fix">
              <a class="legend_icon legend_icon1" href="javascript:;" @click="rightLegend" title="右侧图例"></a>
              <a class="legend_icon legend_icon2" href="javascript:;" @click="bottomLegend" title="底部图例"></a>
              <a class="legend_icon legend_icon3" href="javascript:;" @click="topLegend" title="顶部图例"></a>
            </div>
            <div>
              <el-checkbox v-model="legend.selectedMode">图例是否可选择</el-checkbox>
            </div>
            <div class="fix">图例布局</div>
            <div class="fix">
              <el-dropdown @command="legendOrient" class="l">
                <span class="el-dropdown-link">
                  <span class="font_family_menu">{{legend.orient}}</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="horizontal">horizontal</el-dropdown-item>
                  <el-dropdown-item command="vertical">vertical</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="legendAlign" class="l">
                <span class="el-dropdown-link">
                  <span class="font_family_menu">
                    {{legend.align}}
                  </span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="auto">auto</el-dropdown-item>
                  <el-dropdown-item command="left">left</el-dropdown-item>
                  <el-dropdown-item command="right">right</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="fix">标签样式</div>
            <div class="fix">
              <font :color.sync="legend.textStyle.color" :fontFamily.sync="legend.textStyle.fontFamily" :fontSize.sync="legend.textStyle.fontSize"></font>
            </div>
          </div>
          
        </el-collapse-item>
      </el-collapse>
    </form>
  </div>
</template>
<script type="text/babel">
// 引入字体组件
import font from "./propSelect/font.vue";

export default {
  components: {
    font
  },
  mounted() {
    let that = this;
    that.legendWatcher();
  },
  data: () => ({
    // 默认配置项展开
    activeNames: ["1"],
    // 图例配置
    legend: {
      // type: 'plain',
      show: true,
      right: "0",
      top: "0",
      bottom: "auto",
      data: [],
      selectedMode: true, //图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。
      align: "auto", //图例标记和文本的对齐
      orient: "vertical", //图例列表的布局朝向。
      textStyle: {
        color: "#333",
        fontStyle: "",
        fontWeight: "",
        fontFamily: "sans-serif",
        fontSize: "12"
      }
    }
  }),
  watch: {
    legend: {
      handler: function(val, oldval) {
        this.$emit("legendOptions", {
          option: {
            legend: val
          }
        });
      },
      deep: true
    },
    setLegend: {
      handler: function(val, oldval) {
        this.legend = Object.assign(this.legend, this.setLegend);
      },
      deep: true
    },
    propData: {
      handler: function(val, oldval) {
        this.legendWatcher();
      },
      deep: true
    },
    chartsType: {
      handler: function(val, oldval) {
        this.legendWatcher();
      },
      deep: true
    }
  },
  methods: {
    // 隐藏图例
    hideLegend: function() {
      let that = this;
      that.legend.show = false;
    },
    // 右侧图例
    rightLegend: function() {
      let that = this;
      that.legend.show = true;
      that.legend.right = "0";
      that.legend.top = "0";
      that.legend.bottom = "auto";
    },
    // 底部图例
    bottomLegend: function() {
      let that = this;
      that.legend.show = true;
      that.legend.bottom = "0";
      that.legend.top = "auto";
      that.legend.right = "auto";
    },
    // 顶部图例
    topLegend: function() {
      let that = this;
      that.legend.show = true;
      that.legend.top = "0";
      that.legend.right = "auto";
      that.legend.bottom = "auto";
    },
    // 设置图例字体
    legendfontFamily(command) {
      this.legend.textStyle.fontFamily = command;
    },
    // 设置图例字号
    legendfontSize(command) {
      // let that = this;
      // for(let i = 0;i < that.legend.data.length;i++){
      //   // that.legend.data[i].fontFamily = command;
      //   this.$set(that.legend.data[i], 'fontSize', command);
      // }
      // this.legend.fontSize = command;
      this.legend.textStyle.fontSize = command;
    },
    // 设置图例布局  水平/垂直
    legendOrient(command) {
      this.legend.orient = command;
    },
    // 设置图例文字位置
    legendAlign(command) {
      this.legend.align = command;
    },
    // 监听公用方法
    legendWatcher() {
      let legendKeyArr = [];
      let legendValArr = [];
      // 一个数值时，只有pie funnel rosePie有图例
      if (
        this.propData.query &&
        this.propData.data &&
        this.propData.query.categoryColumns &&
        this.propData.query.categoryColumns.length > 0 &&
        (this.chartsType == "pie" ||
          this.chartsType == "funnel" ||
          this.chartsType == "rosePie")
      ) {
        let categoryColumnsNames = [];
        for (let i = 0; i < this.propData.query.categoryColumns.length; i++) {
          categoryColumnsNames[i] = this.propData.query.categoryColumns[i].name;
        }
        for (let k = 0; k < categoryColumnsNames.length; k++) {
          for (let j = 0; j < this.propData.data.columns.length; j++) {
            if (
              this.propData.data.columns[j].source.name ==
              categoryColumnsNames[k]
            ) {
              legendKeyArr.push(this.propData.data.columns[j].name);
            }
          }
        }
        for (let m = 0; m < legendKeyArr.length; m++) {
          let tem = legendKeyArr[m];
          for (let n = 0; n < this.propData.data.rows.length; n++) {
            legendValArr.push(this.propData.data.rows[n][tem]);
          }
        }
        this.legend.data = legendValArr;
      } else if (this.propData.query && this.propData.query.valueColumns) {
        let valueColumnsNames = [];
        for (let i = 0; i < this.propData.query.valueColumns.length; i++) {
          valueColumnsNames.push(this.propData.query.valueColumns[i].name);
        }
        for (let k = 0; k < valueColumnsNames.length; k++) {
          for (let j = 0; j < this.propData.data.columns.length; j++) {
            if (
              this.propData.data.columns[j].source.name == valueColumnsNames[k]
            ) {
              legendKeyArr.push(this.propData.data.columns[j].source.text);
            }
          }
        }
        // 计量图不需要图例
        if (this.chartsType == "gauge") {
          legendKeyArr = [];
        }
        this.legend.data = legendKeyArr;
      }
    }
  },
  props: ["setLegend", "propData", "chartsType"]
};
</script>
<style scoped>
.pl30 {
  padding-left: 30px;
}
.legend_icon {
  display: inline-block;
  margin-right: 10px;
  width: 24px;
  height: 24px;
}

.legend_icon:hover {
  background-color: #ffffff;
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

