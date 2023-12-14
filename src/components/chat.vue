
<template>
  <div class="panel">
    <HeadBar></HeadBar>
    <div class="bottom">
      <ChatMenu></ChatMenu>
      <ChatBase></ChatBase>
    </div>
    <div class="communication">
      <div>
        <img src="@/assets/Twitter.png" @click="handleGoTo('twitter')" alt="" />
        <span>Twitter</span>
      </div>
      <div>
        <img src="@/assets/Discord.png" @click="handleGoTo('discord')" alt="" />
        <span>Discord</span>
      </div>
    </div>
  </div>
</template>
    
<script setup lang='ts'>
import { computed, watch } from "vue";
// import { useStore } from "vuex";
// const { state, getters, dispatch, commit } = useStore();
// const chatListComputed = computed(() => getters["index/getTopicList"]);
// watch(
//   chatListComputed.value,
//   (val) => {
//     console.log("chatListComputed", val);
//   },
//   { immediate: true }
// );
const handleGoTo = (op: any) => {
  op === "discord"
    ? window.open("https://discord.gg/cQU4XYAtS")
    : window.open("https://twitter.com/Scripts_Pro_");
};
</script>
    

<style lang="scss" scoped>
.panel {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
  .communication {
    position: absolute;
    display: flex;
    padding: 4px;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    border-radius: 6px;
    border: 0.5px solid var(--gray-gray-4, #dcdcdc);
    background: var(--gray-white, #fff);
    bottom: 80px;
    right: 24px;

    /* Shadow/Shadow-3 上层投影 */
    box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08),
      0px 16px 24px 2px rgba(0, 0, 0, 0.04),
      0px 6px 30px 5px rgba(0, 0, 0, 0.05);
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 56px;
      width: 56px;
      cursor: pointer;
    }
    img {
      width: 24px;
      height: 24px;
    }
    span {
      color: var(--text-icon-font-gy-260-secondary, rgba(0, 0, 0, 0.6));
      text-align: center;

      /* Body/Small */
      font-family: PingFang SC;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 166.667% */
    }
  }
  .bottom {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100% - 64px);
  }
}
</style>