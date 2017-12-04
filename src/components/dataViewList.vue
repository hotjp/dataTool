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
          'sourceType': {}
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
        url: '/dataview/list.do',
        baseURL: vars.api,
        params: {
          'folder': ''
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
    handleNodeClick(data) {
      console.log(data);
    }

  }

};
</script>
<style scoped>

</style>