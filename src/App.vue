<template>
<transition name="fade" enter-active-class="animated fadeIn">
    <!-- <transition name="fade"
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    > -->
    <el-container>
        <el-header>
            <router-view name="header"></router-view>
        </el-header>
        <el-main class="full">
            <router-view></router-view>
        </el-main>
    </el-container>
</transition>

</template>
<script>
export default {
  
};
</script>

