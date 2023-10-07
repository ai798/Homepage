<template>
  <div class="base">
    <div class="chat-box">
      <ChatDialog
        :conversation="conversation"
        @done="handleCloseLoading"
      ></ChatDialog>
      <div v-if="!hasHistory" class="info">
        <div class="base-info left-box">
          <img src="@/assets/AI.png" alt="" />
          <div class="dis-info">
            <div class="title">One-Click Summary Of TioTok Videos</div>
            <div class="sub-title">
              AI summarizes TikTok Video content and show you the key points of
              the videos.
            </div>
          </div>
        </div>
        <div class="base-info">
          <img src="@/assets/head.png" alt="" />
          <div class="dis-info">
            <div class="title">Short video script creation assistant</div>
            <div class="sub-title">
              Quickly customize short video scripts for you according to your
              requirements
            </div>
          </div>
        </div>
      </div>
      <div v-show="false">
        <el-button @click="showImprove">Improve</el-button>
        <el-button @click="showGenerate">Generate amazing tweet </el-button>
      </div>
    </div>
    <div class="input-box">
      <div class="top-box">
        <el-input v-model="messageInput" :placeholder="inputLanguage" clearable>
          <template #append>
            <el-button
              type="primary"
              :loading="isLoading"
              @click="onSendMessage"
              :disabled="isLoading"
              >{{ isLoading ? $t("asp_status_thinking") : "Send" }}</el-button
            >
          </template>
        </el-input>
      </div>
      <div class="discripition">{{ computedDis }}</div>
    </div>
  </div>
  <Improve
    v-model:isShowImprove="isShowImprove"
    @closeDialog="handleCloseDialog"
  ></Improve>
  <Generate
    v-model:isShowGenerate="isShowGenerate"
    @closeDialog="handleCloseDialog"
  ></Generate>
</template>
    
<script setup lang='ts'>
import { computed, reactive, ref } from "vue";
import emitter from "@/utils/mitt";
import { useI18n } from "vue-i18n";
import { getChatHistory } from "@/api/index";
const hasHistory = ref(false);
const isShowImprove = ref(false);
const isShowGenerate = ref(false);
const isLoading = ref(false);
const messageInput = ref("");
const uuid: any = computed(() => window.localStorage.getItem("script_uuid"));
const lang: any = computed(() => window.localStorage.getItem("lang"));
const { t, locale } = useI18n();
const computedDis = computed(() => {
  return hasHistory.value
    ? t("asp_tips_guide_prompt")
    : t("asp_tips_enter_video_link_b");
});
const inputLanguage = computed(() =>
  hasHistory.value
    ? t("asp_tips_guide_ask_question")
    : t("asp_tips_enter_video_link_a")
);
const conversation = reactive({
  name: "gpt-3.5-turbo",
  frequency_penalty: 0,
  presence_penalty: 0,
  total_tokens: 4096,
  max_tokens: 1000,
  temperature: 0.7,
  top_p: 1,
  openaiApiKey: null,
  user_name: uuid.value,
  lang: "",
  message: [] as any,
  conversationId: null,
  frugalMode: false,
});
const showImprove = () => {
  isShowImprove.value = true;
};
const showGenerate = () => {
  isShowGenerate.value = true;
};
const handleCloseDialog = () => {
  isShowImprove.value = false;
  isShowGenerate.value = false;
};
const onSendMessage = () => {
  isLoading.value = true;

  conversation.lang = locale.value;
  conversation.message = [
    {
      content: messageInput.value,
      tool: "chat",
      message_type: 0,
    },
  ];
  hasHistory.value = true;
  messageInput.value = "";
  console.log(conversation);
  emitter.emit("sendMessage", conversation);
};
const handleCloseLoading = () => {
  console.log("isloading", isLoading.value);
  isLoading.value = false;
};
const getChatHistoryOption = (id?: any) => {
  getChatHistory([uuid.value, id]).then((res: any) => {
    if (res) {
      conversation.message = [];
      hasHistory.value = true;
      res.forEach((e: any) => {
        conversation.message.push({
          content: e.message,
          message_type: e.is_bot ? 1 : 0,
        });
      });
    }
  });
};
const handleGetHistory = (item: any) => {
  getChatHistoryOption(item.id);
};
getChatHistoryOption();
emitter.on("getHistory", handleGetHistory);
</script>
    
<style lang="scss" scoped>
.base {
  background: #fff;
  width: 100%;
  height: 100%;
  position: relative;
  .chat-box {
    height: calc(100% - 136px);
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(-60%);
      .left-box {
        margin-right: 132px;
      }
      .base-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        img {
          position: absolute;
          width: 88px;
          height: 88px;
          flex-shrink: 0;
          transform: translate(0, -50%);
          top: 0;
        }
      }
      .dis-info {
        width: 200px;
        height: 240px;
        flex-shrink: 0;
        border-radius: 30px;
        background: #fafafa;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 0 16px;
        .title,
        .sub-title {
          color: #111827;
          text-align: center;
          font-family: Source Code Pro;
          font-size: 18px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
        }
        .title {
          margin-bottom: 8px;
        }
        .sub-title {
          font-size: 16px;
          font-weight: 400;
        }
      }
    }
  }
  .input-box {
    height: 136px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .el-input {
      display: inline-flex;
      height: 56px;
      padding: 8px 8px 8px 24px;
      align-items: center;
      flex-shrink: 0;
      border-radius: 8px;
      // border: 1px solid #1454ff;
      background: #fff;
      position: relative;
      width: 856px;
    }
  }
  :deep(.el-input__wrapper) {
    position: relative;
    height: 54px;
  }
  :deep(.el-input__suffix) {
    position: absolute;
    right: 75px !important;
  }
  :deep(.el-input-group__append) {
    color: #fff;
    display: flex;
    height: 54px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: #1454ff;
    position: absolute;
    right: 0;
  }
  .discripition {
    color: #1454ff;
    text-align: center;
    font-family: Source Code Pro;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 133.333% */
    margin-top: 8px;
  }
  .el-button.is-loading:before {
    background: none;
  }
}
</style>