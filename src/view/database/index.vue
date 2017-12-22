<template>
  <div class="full">
    <el-row  id="database">
      <el-col :span="5" class="database_left full">
        <div class="title">我的数据源</div>
        <ul class="database_list ">
          <li v-for="(item,index) in list" :key="index" :class="{hover:hoverIndex == index}">
            <!-- <router-link :to="{path:'/chart_editor/'+item.id}"> -->
            <span class="database_name">{{item.name}}</span>
            <i class="el-icon-more" @mouseenter="mouseenter(index)" @mouseleave="mouseleave()" ></i>
            <div class="cover" @mouseenter="mouseenter(index)" @mouseleave="mouseleave()" >
              <a href="javascript:;" @click="onEditClick(item.id)">修改</a>
              <a href="javascript:;" @click="onCreateSourceClick(item.id)">创建</a>
            </div>
           
            <!-- </router-link> -->
          </li>
          <li>
            <a href="javascript:;" @click="onAddSourceClick">+ 增加数据源</a>
          </li>
        </ul>
      </el-col>
      <el-col :span="19">
        <div class="grid-content database_right">
          <div class="top fix">
            <a href="javascript:;" class="database_add" @click="onAddSourceClick">添加数据源</a>

          </div>
          <!-- <div v-if="pageType == 'index'"> -->
            <!-- 在左侧列表选择对应数据源进行操作或 -->
          <!-- </div> -->
        </div>
      </el-col>
    </el-row>

    <dataSourceDialog @changeDialogFormVisible="changeFatherDialogFormVisible" v-if="dialogFormVisible" :form="form"></dataSourceDialog>
  </div>
</template>
<script>
// import chartUI from '../../assets/js/chartUI';
import vars from "../../assets/js/vars";
import axios from "axios";
import dataSourceDialog from "../../components/dataSource/dataSourceDialog.vue";

// import IEcharts from 'vue-echarts-v3/src/full.vue';
export default {
  components: {
    dataSourceDialog
  },
  mounted() {
    this.updateList();
    window.vm = this;
  },
  data() {
    return {
      //是否可保存
      //        canSave:false,
      pageName: "数据源添加",
      // 数据源列表
      list: [],
      pageType: "index",
      dialogFormVisible: false,
      form: {
        //            name: 'test',
        //            host: '192.168.50.200',
        //            port: '1655',
        //            database: 'ERP_LOCAL_TEST',
        //            user: 'msiJava',
        //            password: 'msiJava',
        //            id: '',
        //            dbType: 'SQLServer'
      },
      formLabelWidth: "120px",
      hoverIndex:null
    };
  },
  methods: {
    updateList() {
      let that = this;
      axios({
        url: "/datasource/list.do",
        baseURL: vars.api,
        params: {}
      })
        .then(function(res) {
          var resData = res.data;
          if (resData.success) {
            console.log(resData.data);
            that.list = resData.data;
          }
        })
        .catch(function(res) {
          console.error(res);
        });
    },
    onAddSourceClick() {
      this.$router.push("/database/add");
    },
    onCreateSourceClick(id) {
      // TODO: 链接不对
      // this.$router.push("/database/creatView/" + id);
    },
    onEditClick(paramId) {
      let that = this;
      axios({
        method: "post",
        url: "/datasource/info.do",
        baseURL: vars.api,
        params: {
          datasource: paramId
        }
      })
        .then(function(res) {
          var resData = res.data;
          if (resData.success) {
            //            console.log(resData.data);
            that.form = resData.data;
            that.dialogFormVisible = true;
          }
        })
        .catch(function(res) {
          console.error(res);
        });
    },
    //显示隐藏dataSourceDialog组件
    changeFatherDialogFormVisible(value) {
      this.dialogFormVisible = value;
    },
    mouseenter(index){
      this.hoverIndex = index;
    },
    mouseleave(){
      this.hoverIndex = null;
    }
  }
};
</script>
<style>
.database_list li {
  line-height: 26px;
}
</style>