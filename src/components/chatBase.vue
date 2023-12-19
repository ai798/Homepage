<template>
  <div class="base">
    <div class="chat-box">
      <ChatDialog
        :conversation="conversation"
        @done="handleCloseLoading"
        @error="handleCloseLoadingOnError"
        :isGetHistory="isGetHistory"
      >
        <template #option>
          <div class="option" v-show="showOpt">
            <el-button
              v-show="!isLoading && !getters['index/getIsError']"
              @click="showGenerate"
              >Generate similar script</el-button
            >
            <el-button
              v-show="!isLoading && !getters['index/getIsError']"
              @click="showImprove"
              >Generate amazing tweet
            </el-button>
          </div>
        </template>
      </ChatDialog>
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
    </div>
    <div class="input-box">
      <div class="top-box">
        <el-input
          v-model="messageInput"
          @keydown="onKeyDown"
          :placeholder="inputLanguage"
          clearable
          autosize
          type="textarea"
        >
        </el-input>
        <el-button
          class="input-button"
          type="primary"
          :loading="isLoading"
          @click="onSendMessage"
          :disabled="isLoading"
          >{{ isLoading ? $t("asp_status_thinking") : "Send" }}</el-button
        >
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
    @handleSubmit="handleSubmitOpt"
  ></Generate>
</template>
    
<script setup lang='ts'>
import { computed, nextTick, reactive, ref, watch } from "vue";
import emitter from "@/utils/mitt";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { getChatHistory } from "@/api/index";
import { useStore } from "vuex";

import { MessageType, Hidden } from "@/enums/typeEnum";
const { state, getters, dispatch, commit } = useStore();

const hasHistory = ref(false);
const isShowImprove = ref(false);
const isShowGenerate = ref(false);
const isGetHistory = ref(false);
const isLoading = ref(false);
const showOpt = ref(false);
const messageInput = ref<string>("");
const uuid: any = computed(() => window.localStorage.getItem("script_uuid"));
const { t, locale } = useI18n();
const conversationIdFromStroe = computed(() => state.index.conversationId);
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
  message: [] as any,
  conversation_id: state.index.conversationId,
  frugalMode: false,
  stream: true,
});
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    if (isLoading.value) {
      ElMessage.error({
        customClass: "error",
        message: t("toast_thinking_stop_send_prompt"),
      });
      messageInput.value = "";
      return;
    }
    onSendMessage();
  }
};
const showImprove = () => {
  // isShowImprove.value = true;
  onSendMessage({}, MessageType.TWITERR);
};
const showGenerate = () => {
  isShowGenerate.value = true;
};
const handleCloseDialog = () => {
  isShowImprove.value = false;
  isShowGenerate.value = false;
};

const onSendMessage = (opt?: any, messageType?: any) => {
  console.log("messageInput.value", messageInput.value);
  if (!messageInput.value && !opt) return;

  isLoading.value = true;
  isGetHistory.value = false;
  conversation.conversation_id = state.index.conversationId;
  if (opt) {
    conversation.message = [
      {
        content: "",
        tool: "chat",
        is_bot: false,
        duration: opt.duration,
        scene: opt.scene,
        message_type: messageType,
        is_link: conversation.conversation_id ? 0 : 1,
      },
    ];
  } else {
    conversation.message = [
      {
        content: messageInput.value,
        tool: "chat",
        is_bot: false,
        message_type: conversation.conversation_id ? "10" : "90",
        is_link: conversation.conversation_id ? 0 : 1,
      },
    ];
  }

  hasHistory.value = true;
  emitter.emit("sendMessage", conversation);
  setTimeout(() => {
    messageInput.value = "";
  }, 0);
};
const handleSubmitOpt = (sence: Array<any>, duration: any) => {
  console.log(sence, duration);
  onSendMessage(
    { sence: sence.toString(), duration: duration },
    MessageType.SCRIPT
  );
};
const handleCloseLoading = () => {
  isLoading.value = false;
  showOpt.value = true;
};
const handleCloseLoadingOnError = () => {
  isLoading.value = false;
  showOpt.value = false;
};
const getChatHistoryOption = (id?: any) => {
  isGetHistory.value = true;
  emitter.emit("stopReceive");
  getChatHistory(id)
    .then((res: any) => {
      if (res) {
        conversation.message = [];
        conversation.conversation_id = conversationIdFromStroe.value;
        hasHistory.value = true;
        res.payload.message_list.forEach((e: any) => {
          conversation.message.push({
            content: e.message,
            message_type: e.message_type,
            is_bot: e.is_bot,
          });
        });
      }
    })
    .finally(() => {
      if (conversation.message.length) {
        showOpt.value = true;
        isGetHistory.value = false;
        isLoading.value = false;
      }
    });
};
const handleGetHistory = (item: any) => {
  commit("index/SET_CONVERSION_ID", item.id);

  getChatHistoryOption(item.id);
};

// nextTick(()=>{
//   console.log(firstTopicId.value)
//   getChatHistoryOption();
// })
watch(
  () => state.index.topicList,
  (val) => {
    console.log(`getters['index/getTopicList']`, val);
  },
  { immediate: true }
);
emitter.on("getHistory", handleGetHistory);
const handleOpenNewChat = () => {
  commit("index/SET_CONVERSION_ID", null);
  hasHistory.value = false;
  showOpt.value = false;
  conversation.message = [];
};
emitter.on("openNewChat", handleOpenNewChat);
</script>
    
<style lang="scss" scoped>
.base {
  background: #fff;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  .chat-box {
    height: calc(100% - 136px);
    position: relative;
    .option {
      display: flex;
      justify-content: flex-end;
      padding-right: 135px;
      button {
        color: #fff;
        border-radius: 8px;
        background: #1a1a1a;
      }
    }
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
    :deep(.el-textarea__inner) {
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
    .top-box {
      position: relative;
    }
    .input-button {
      position: absolute;
      right: 0;
    }
  }
  :deep(.el-input__wrapper) {
    position: relative;
    height: 54px;
    justify-content: flex-start;
    &:deep.el-input__inner {
      width: calc(100% - 100px);
    }
  }
  :deep(.el-input__suffix) {
    position: absolute;
    right: 95px !important;
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
    width: 50px;
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
    display: inline-block;
  }
  .el-button.is-loading:before {
    background: none;
  }
}
</style>