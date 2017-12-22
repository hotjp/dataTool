<template>
  <div class="full">
    <el-row id="addDataList">
      <el-col :span="18" :offset="3">
        <div class="grid-content">
          <div class="input_wrap">
            <el-input placeholder="请输入想要接入的数据源" prefix-icon="el-icon-search" v-model="searchContent"></el-input>
          </div>
          <el-row  class="database_list" :gutter="20">
            <el-col :span="6" v-for="(item,index) in list" :key="index">
              <div class="database_item rect-100">
                <!-- <router-link :to="{path:'/chart_editor/'+item.id}"> -->
                <img :src="item.img" alt="">
                {{item.name}}
                <a href="javascript:;" class="_full" @click="addDataSource(item.type,item.name)"></a>
                <!-- </router-link> -->
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="上传excel文件" :visible.sync="dialogUploadVisible" width="30%">
      <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <dataSourceDialog @changeDialogFormVisible="changeFatherDialogFormVisible" v-if="dialogFormVisible" :form="form"></dataSourceDialog>

  </div>
</template>
<script>
// import chartUI from '../../assets/js/chartUI';
import vars from '../../assets/js/vars';
//import axios from 'axios';
import dataSourceDialog from '../../components/dataSource/dataSourceDialog.vue';
import dataSourceList from '../../vendor/dataSourceList.json';

// import IEcharts from 'vue-echarts-v3/src/full.vue';
export default {
  components: {
    dataSourceDialog
  },
  mounted() {
    this.list = dataSourceList;
  },
  data() {
    return {
      //是否可保存
      //      canSave: false,
      //上传文件列表
      fileList: [],

      dialogFormVisible: false,
      pageName: '数据源添加',
      // 数据源列表
      list: [
        //        {
        //          name: 'excel',
        //          type: 'upload'
        //        },
        //        {
        //          name: 'SQLServer',
        //          type: 'form'
        //        },
        //        {
        //          name: 'MySQL',
        //          type: 'form'
        //        },
        //        {
        //          name: 'Hive2',
        //          type: 'form'
        //        }
      ],
      pageType: '',
      dialogUploadVisible: false,
      form: {
        //        name: 'test',
        //        jdbcHost: '192.168.50.200',
        //        jdbcPort: '1655',
        //        jdbcDatabase: 'ERP_LOCAL_TEST',
        //        jdbcUser: 'msiJava',
        //        password: 'msiJava',
        //        id: '',
        //        dbType: 'SQLServer'
      },
      formLabelWidth: '120px',
      searchContent:''
    };
  },
  methods: {
    onAddSourceClick() {
      this.dialogFormVisible = true;
    },
    addDataSource(type, name) {
      this.pageType = type;
      this.form.dbType = name;
      if (type === 'form') {
        this.dialogFormVisible = true;
      } else if (type === 'upload') {
        this.dialogUploadVisible = true;
      }
    },
    changeFatherDialogFormVisible(value) {
      this.dialogFormVisible = value;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    }

  }
};
</script>
<style>
.database_list li {
  line-height: 26px;
}
</style>