
<template>
  <chartBar v-if="type=='bar'" :option="option" :data="data" @getSeries="getOption"></chartBar>
  <chartLine v-else-if="type=='line'" :option="option" :data="data" @getSeries="getOption"></chartLine>
  <chartPie v-else-if="type=='pie'" :option="option" :data="data" @getSeries="getOption"></chartPie>
  <chartArea v-else-if="type=='area'" :option="option" :data="data" @getSeries="getOption"></chartArea>
</template>

<script>
import chartBar from '../chartsComponents/chart-bar.vue';
import chartLine from '../chartsComponents/chart-line.vue';
import chartPie from '../chartsComponents/chart-pie.vue';
import chartArea from '../chartsComponents/chart-area.vue';

export default {
  // TODO 动态加载组件，根据type，动态传参
  mounted() {
    // 挂载后
    let that = this;
    // (() => Object.assign(that.seriesOption.option, that.option))();
    // (() => Object.assign(that.seriesOption.data, that.data))();
  },
  data() {
    // 组件数据
    return {
      seriesOption: {
        //  样式配置
        option: {
          
        }
        //  数据
        // data: {}
      }
      // type: "bar"
    };
  },
  watch: {
    type:function(newVal,oldVal){
      // this.$emit("submitOption", this.seriesOption);
      this.data.random = Math.random();
    }
  },
  props: ['option', 'data','type'],
  components: {
    chartBar,chartLine,chartPie,chartArea
  },
  methods: {
    getOption(data) {
      this.$emit('submitOption', data);
    }
  }
};
</script>

<style>

</style>
