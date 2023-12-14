<template>
  <router-view></router-view>
</template>
  
<script setup lang='ts'>
import { onMounted, onUpdated, watch } from "vue";
import { useStore } from "vuex";
const { dispatch, state } = useStore();

const init = () => {
  dispatch("index/initData");
};
onMounted(() => {
  // init();
});
</script>
  
<style>
</style>