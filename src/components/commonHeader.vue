<template>
  <div id="commonHeader">
    <a @click="backToPrev" href="javascript:;">返回</a> 当前页：{{$attrs.name}}
  </div>
</template>
<script>
export default {
  methods: {
    backToPrev() {
      history.back();
    }
  }
};
</script>
