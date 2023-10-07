<template>
  <div class="chat-menu">
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
import { ref } from "vue";
const chatList = ref([] as any);
const handleNewChat = () => {
  //create new chat
  chatList.value.push({ topic: "One new chat" });
};
const userId = window.localStorage.getItem("script_uuid");
const handleGetChatList = () => {
  getChatList(userId).then((res) => {
    chatList.value = res;
  });
};
getChatList(userId).then((res) => {
  chatList.value = res;
});
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