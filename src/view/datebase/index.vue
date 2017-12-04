<template>
  <div id="datebase" class="full">
    <el-row>
      <el-col :span="4">
        <div class="grid-content">
          <ul class="datebase_list">
            <li v-for="(item,index) in list" :key="index">
              <!-- <router-link :to="{path:'/chart_editor/'+item.id}"> -->
              {{item.name}}
              <a href="javascript:;" @click="onEditClick(item.id)">修改</a>
              <a href="javascript:;" @click="onCreateSourceClick(item.id)">创建</a>
              <!-- </router-link> -->
            </li>
            <li>
              <a href="javascript:;" @click="onAddSourceClick">+ 增加数据源</a>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content">
          <div v-if="pageType == 'index'">
            在左侧列表选择对应数据源进行操作或
            <a href="javascript:;" @click="onAddSourceClick">添加数据源</a>
          </div>
        </div>
      </el-col>
    </el-row>

    <dataSourceDialog @changeDialogFormVisible="changeFatherDialogFormVisible" v-if="dialogFormVisible" :form="form"></dataSourceDialog>
  </div>
</template>
<script>
// import chartUI from '../../assets/js/chartUI';
import vars from '../../assets/js/vars';
import axios from 'axios';
import dataSourceDialog from '../../components/dataSource/dataSourceDialog.vue';

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
      pageName: '数据源添加',
      // 数据源列表
      list: [],
      pageType: 'index',
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
      formLabelWidth: '120px'
    };
  },
  methods: {
    updateList() {
      let that = this;
      axios({
        url: '/datasource/list.do',
        baseURL: vars.api,
        params: {
        }
      })
        .then(function (res) {
          var resData = res.data;
          if (resData.success) {
            // console.log(resData.data);
            that.list = resData.data;
          }
        })
        .catch(function (res) {
          console.error(res);
        });
    },
    onAddSourceClick() {

      this.$router.push('/datebase/add');
    },
    onCreateSourceClick(id) {

      this.$router.push('/datebase/creatView/'+id);
    },
    onEditClick(paramId) {
      let that = this;
      axios({
        method: 'post',
        url: '/datasource/info.do',
        baseURL: vars.api,
        params: {
          datasource: paramId
        }
      })
        .then(function (res) {
          var resData = res.data;
          if (resData.success) {
            //            console.log(resData.data);
            that.form = resData.data;
            that.dialogFormVisible = true;
          }
        })
        .catch(function (res) {
          console.error(res);
        });

    },
    //显示隐藏dataSourceDialog组件
    changeFatherDialogFormVisible(value) {
      this.dialogFormVisible = value;
    }
  }
};
</script>
<style>
.datebase_list li {
  line-height: 26px;
}
</style>