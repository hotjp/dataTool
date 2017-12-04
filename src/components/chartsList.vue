<template>
    <div>
        <ul>
            <li v-for="(item,index) in chartsList" :key="index">
                <a href="javascript:;" :data-id="item.id">
                    <i>{{item.dir?'文件夹':item.type}}</i>
                    {{item.text}}
                </a>
            </li>
        </ul>
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
      chartsList: []

    };
  },
  methods: {
    updateList() {
      let that = this;
      axios({
        url: '/chart/list.do',
        baseURL: vars.api,
        params: {
          'folder': '/'
        }
      })
        .then(function (res) {
          var resData = res.data;
          if (resData.success) {
            console.log(resData.data);
            that.chartsList = resData.data;
          }
        })
        .catch(function (res) {
          console.error(res);
        });
    }

  }

};
</script>
<style scoped>

</style>