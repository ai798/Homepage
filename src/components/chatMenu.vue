<template>
  <div class="chat-menu" v-loading="onLoading">
    <div class="chat-opt">
      <ChatList @updateList="handleGetChatList" :list="chatList"></ChatList>
    </div>
    <div class="bottom-box">
      <el-button @click="handleNewChat">{{ $t("asp_btn_new_chat") }}</el-button>
    </div>
  </div>
</template>
    
<script  lang='ts' setup>
import { getChatList } from "@/api/index";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import emitter from "@/utils/mitt";
import { useStore } from "vuex";
const { state, getters, dispatch, commit } = useStore();
const chatList = ref([] as any);
const onLoading = ref(false);
const handleNewChat = () => {
  //create new chat
  emitter.emit("openNewChat");
  commit("index/SET_CURRENT_ITEM", {});
};
const userId = window.localStorage.getItem("script_uuid");
const handleGetChatList = () => {
  onLoading.value = true;
  getChatList(userId)
    .then((res) => {
      chatList.value = res.payload?.conversation_list ?? [];
      commit("index/SET_CHAT_LIST", res.payload.conversation_list);
    })
    .finally(() => {
      onLoading.value = false;
    });
};
onMounted(() => {
  chatList.value = state.topicList;
});
getChatList(userId).then((res) => {
  if (res.payload.conversation_list) {
    chatList.value = res.payload.conversation_list;
    commit("index/SET_CHAT_LIST", res.payload.conversation_list);
  }
});
emitter.on("refreshList", handleGetChatList);
</script>
    
<style lang="scss" scoped>
.chat-menu {
  width: 225px;
  height: 100%;
  flex-shrink: 0;
  background: #fafafa;
  .chat-opt {
    padding: 16px 12px;
    height: calc(100% - 114px);
    overflow: scroll;
  }
  .bottom-box {
    width: 225px;
    position: fixed;
    bottom: 0;
    height: 80px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin: auto 0;
    text-align: center;
    line-height: 80px;
    .el-button {
      width: 149px;
      height: 44px;
      flex-shrink: 0;
      border-radius: 8px;
      border: 1px solid var(--, #111827);
      background: #fafafa;
    }
  }
}
</style>