<template>
    <div>
        <el-row>
            <el-col :span="4">
                <div>
                    <span class="input_label">名 称</span>

                    <input type="text" />
                </div>
                <br>
                <div>
                    <span class="input_label">数据源</span>

                    <input type="text" />
                </div>
                <button>保存</button>
                <br>
                <button>刷新数据表</button>
                <ul>
                    <li v-for="(item,index) in lists" :key="index">
                        {{item.name}}
                        <a href="javascript:;" class="add_btn" @click="onClickFetchTable(item)"> > </a>
                    </li>
                </ul>

            </el-col>
            <el-col :span="20">
                <button>预览数据</button>
                <hr>
                <span>关系图</span>
                <div v-for="(item,index) in relationSchema" :key="index">
                    <span>{{item.name}}</span>
                    <p>
                        {{JSON.stringify(item.columns)}}
                    </p>

                </div>
                <hr>
                <span>数据预览</span>
                <div v-if="previewFlag">
                    query: {{JSON.stringify(tables)}}
                </div>

            </el-col>
        </el-row>
    </div>
</template>

<script>
import vars from '../../assets/js/vars';
import axios from 'axios';

export default {
  mounted() {
    this.updateList();
  },
  data() {
    // 组件数据
    return {
      lists: [],
      refTables: [],
      relationSchema: [],
      previewFlag: false
    };
  },
  watch: {},
  computed: {
    tables: function () {
      let str = JSON.stringify(this.relationSchema);
      let tem = JSON.parse(str);
      for (let i = 0; i < tem.length; i++) {
        tem[i]['alias'] = '';
      }

      return { 'tables': tem };
    }
  },
  methods: {
    updateList() {
      let that = this,
        params = that.$route.params;
      axios({
        url: '/datasource/metadata/listTables.do',
        baseURL: vars.api,
        params: {
          'datasource': params.id
        }
      })
        .then(function (res) {
          var resData = res.data;
          if (resData.success) {
            that.lists = resData.data;
          }
        })
        .catch(function (res) {
          console.error(res);
        });
    },
    onClickFetchTable(item) {
      let that = this,
        params = that.$route.params;
      let table = item.name;
      let type = item.type;
      axios({
        url: '/datasource/metadata/table.do',
        baseURL: vars.api,
        params: {
          'datasource': params.id,
          'table': table,
          'type': type,
          'refTables': that.refTables.join(',')
        }
      })
        .then(function (res) {
          var resData = res.data;
          if (resData.success) {
            let obj = {
              'columns': resData.data.metadata.columns,
              'name': item.name
            };
            that.relationSchema.push(obj);
            that.refTables.push(item.name);
            that.previewFlag = true;
            that.previewViewQuery();
          }
        })
        .catch(function (res) {
          console.error(res);
        });


    },
    previewViewQuery() {
      let that = this,
        params = that.$route.params;

      axios({
        method: 'post',
        url: '/preview.do',
        baseURL: vars.api,
        params: {
          'datasource': params.id,
          'view': JSON.stringify(that.tables)
        },
        data: {}
      })
        .then(function (res) {
          console.log(res);
          //                  var resData = res.data;
          //                  if (resData.success) {
          //
          //                  }
        })
        .catch(function (res) {
          console.error(res);
        });

    }
  }
};
</script>

<style scoped>
.input_label {
  display: inline-block;
  width: 50px;
}
.add_btn {
  display: inline-block;
  width: 15px;
  height: 15px;
  color: white;
  background-color: orangered;
}
</style>
