<template>
    <div id="datebase" class="full">
        <el-row class="full">
            <el-col class="full" :span="4">
                <div class="grid-content full">
                    <ul class="datebase_list">
                        <li v-for="(item,index) in list" :key="index">
                            <!-- <router-link :to="{path:'/chart_editor/'+item.id}"> -->
                                {{item.name}}
                            <!-- </router-link> -->
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col class="full" :span="12">
                中间占位
            </el-col>
            <el-col class="full" :span="8">
                右侧占位
            </el-col>
        </el-row>
    </div>
</template>
<script>
// import chartUI from '../../assets/js/chartUI';
// import vars from "../../assets/js/vars";
import axios from "axios";
// import IEcharts from 'vue-echarts-v3/src/full.vue';
export default {
  mounted() {
    let that = this;
    axios({
      url: "http://119.180.98.134:8880/dataviz/api/dataviews.do",
    })
      .then(function(res) {
        var resData = res.data;
        if (resData.success) {
        //   console.log(resData.data.rows);
            that.list = that.list.concat(resData.data.rows);
        }
      })
      .catch(function(res) {
        console.log(res);
      });
  },
  data() {
    return {
      // 图标列表
      list: [],
      pageName: "仪表盘"
    };
  },
  computed: {
    // 计算
  },
  methods: {
     
  }
};
</script>
<style>
.datebase_list li{
    line-height: 26px;
}
</style>