<template>
    <div id="chartEditor" class="full">
        <commonHeader :name="pageName"></commonHeader>
        <el-row class="full">
            <el-col class="full" :span="4">
                <div class="grid-content full">
                  当前表：{{tableName}} <br>
                  字段：
                  日期单独做

                </div>
                
            </el-col>
            <el-col class="full" :span="12">
                <div class="grid-content full">
                </div>
            </el-col>
            <el-col class="full" :span="8">
                <div class="grid-content full">
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import chartUI from '../../assets/js/chartUI';
export default {
  mounted() {
    var inputs = this.$el.getElementsByTagName('input');
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', true, true);
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].dispatchEvent(evt);
    }
  },
  data() {
    return {
      pageName: '图表编辑',
      tableName:'当前表名',
      arr: [{
        name: '1111ssssssssss1111111111111111111111'
      }]
    };
  },

  methods: {
    trigger() {
      var el = event.target;
      autoGrow(el);
    }
  }
};

function autoGrow(el) {
  if (el.scrollWidth > el.clientWidth) {
    el.style.width = el.scrollWidth + 'px';
  }
}
</script>
<style>
#app {
    font-family: Helvetica, sans-serif;
    text-align: center;
}
</style>