<template>
  <div id="commonHeader">
    <a @click="backToPrev" href="javascript:;">
      <i class="back_icon"></i>
    </a>
    <span>{{$route.name}}</span>
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
