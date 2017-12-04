<template>
    <div>
        <el-tree :data="lists" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
</template>
<script type="text/babel">
import vars from '../assets/js/vars';
import axios from 'axios';

export default {
  mounted() {
    this.updateList();
  },
  data: function () {
    return {
      lists: [
        {
          'name': '',
          'id': '',
          'children': []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      }

    };
  },
  methods: {
    updateList() {
      let that = this;
      axios({
        url: '/dataview/listFolders.do',
        baseURL: vars.api,
        params: {
          'folder': '',
          'dataview': true
        }
      })
        .then(function (res) {
          var resData = res.data;
          if (resData.success) {
            //                            console.log(resData.data);
            that.lists = resData.data.folders.concat(resData.data.dataviews);
          }
        })
        .catch(function (res) {
          console.error(res);
        });
    },
    handleNodeClick(data) {
      console.log(data);
    }

  }

};
</script>
<style scoped>

</style>