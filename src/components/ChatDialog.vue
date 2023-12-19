<template>
  <div ref="grab" class="container-box" v-loading="isGetHistory">
    <!-- <p id="response_row" v-if="fetchingResponse" class="result-streaming"></p> -->

    <div class="err" v-if="isError">{{ errMsg }}</div>
    <div class="outer-box" v-for="(item, index) in messageList" :key="index">
      <div
        v-if="
          !Hidden.includes(item.message_type) &&
          (item.is_bot === false ||
            item.message_type === MessageType.CONVERSATION) &&
          !item.is_link
        "
        class="people"
      >
        <span class="people_text">{{ item.content }}</span>
      </div>

      <v-md-preview
        v-else-if="item.is_bot && item.message_type === MessageType.REPALY"
        class="robot"
        :text="item.content"
      ></v-md-preview>
    </div>

    <div ref="container" class="ref-container"></div>
    <div v-if="isThinking" class="is_inputing_conntent"></div>

    <slot name="option"></slot>
  </div>
</template>

<script lang="ts" setup>
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { MessageType, Hidden } from "@/enums/typeEnum";
import { onMounted, reactive, ref, unref, watch } from "vue";
import emitter from "@/utils/mitt";
import { useStore } from "vuex";
const ApplicationJsonType = "application/json";
const isWatiing = ref(false);
const isThinking = ref(false);
const isError = ref(false);
const grab = ref();
const errMsg = ref("");
const container = ref();
let ctrl = ref(null as any);
const messageQueue = ref([] as any);
const messageList = ref([] as any);
const enableWebSearch = ref(false);
const { state, getters, dispatch, commit } = useStore();

const refreshPage = () => {
  let height =
    document.getElementsByClassName("container-box")[0]?.scrollHeight;

  // container.value.scrollTo({ top: height, behavior: "smooth" });
  scrollToBottom();
};
const isUrl = (str: any) => {
  var v = new RegExp(
    "^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
    "i"
  );
  return v.test(str);
};

onMounted(() => {
  refreshPage();
});
const props = defineProps({
  conversation: {
    type: Object as any,
    required: true,
  },
  isGetHistory: {
    type: Boolean,
    require: true,
  },
});
const emits = defineEmits(["done", "error"]);
watch(
  messageList.value,
  (val) => {
    if (val.length) {
      refreshPage();
    }
  },
  { immediate: true }
);
var delay = 5; //in milliseconds
var scroll_amount = 30; // in pixels
var interval: any;
const scroller = () => {
  var old = document.getElementsByClassName("container-box")[0]?.scrollTop; //保存当前滚动条到顶端的距离
  document.getElementsByClassName("container-box")[0].scrollTop +=
    scroll_amount; //让滚动条继续往下滚动
  if (document.getElementsByClassName("container-box")[0].scrollTop == old) {
    //到底部后就无法再增加scrollTop的值
    console.log("123123");
    clearInterval(interval);
  }
};
const scrollToBottom = () => {
  interval = setInterval(scroller, delay);
};

watch(
  props.conversation,
  (e) => {
    if (e && props.isGetHistory) {
      isError.value = false;
      messageList.value = [];
      messageList.value = messageList.value.concat(props.conversation.message);
      scrollToBottom();

      // setTimeout(() => {
      //   let height =
      //     document.getElementsByClassName("container-box")[0]?.scrollHeight;

      //   console.log("height", height);
      //   container.value.scrollHeight = height;
      // }, 0);
      console.log("container.value", container.value);
      // grab.value.scrollIntoView({ behavior: "smooth" });
    }
  },
  { immediate: true }
);
let isProcessingQueue = false;
let intervalId: any;
const processMessageQueue = () => {
  var doc = document.getElementsByClassName("vuepress-markdown-body")[0];
  if (doc) {
  }
  if (isProcessingQueue || messageQueue.value.length === 0) {
    return;
  }
  if (
    props.conversation.message[props.conversation.message.length - 1]
      .message_type === "10"
  ) {
    props.conversation.message.push({ id: null, is_bot: true, message: "" });
  }
  isProcessingQueue = true;
  const nextMessage = messageQueue.value;
  let wordIndex = 0;
  messageList.value.push({ content: "", message_type: "10", is_bot: true });
  console.log("mesageQueue->", messageQueue.value);
  intervalId = setInterval(() => {
    messageList.value[messageList.value.length - 1].content +=
      nextMessage[wordIndex];
    wordIndex++;
    console.log("wordIndex->", wordIndex);
    isThinking.value = false;
    let height =
      document.getElementsByClassName("container-box")[0]?.scrollHeight;

    // container.value.scrollTo({ top: height, behavior: "smooth" });
    scrollToBottom();
    if (wordIndex === messageQueue.value.length) {
      emits("done");
      clearInterval(intervalId);
      if (isUrl(props.conversation.message[0].content)) {
        emitter.emit("refreshList");
      }
      messageQueue.value = [];
      isWatiing.value = false;
      isProcessingQueue = false;
      // processMessageQueue();
    }
    // props.conversation.messages[props.conversation.messages.length - 1].message += nextMessage
    // isProcessingQueue = false
    // processMessageQueue()
  }, 145);
};
const send = (message: any) => {
  // if (isWatiing.value) return;
  // if (!message.message || message.message.trim() === "") return;
  if (props.conversation.messages) {
    // unknow
    // addConversation(props.conversation);
  }
  messageList.value.push(...message.message);
  isWatiing.value = true;

  fetchReply(message);
  scrollChatWindow();
};
const scrollChatWindow = () => {
  if (grab.value === null) {
    return;
  }
  // grab.value.scrollIntoView({ behavior: "smooth" });
};
const abortFetch = () => {
  if (ctrl.value) {
    ctrl.value.abort();
  }
};

const fetchReply = async (message: any) => {
  messageQueue.value = [];
  ctrl.value = new AbortController();

  let msg = message;
  if (Array.isArray(message)) {
    msg = message[message.length - 1];
  } else {
    message = message;
  }

  let webSearchParams = reactive({} as any);
  if (enableWebSearch.value || msg.tool == "web_search") {
    webSearchParams["web_search"] = {
      ua: navigator.userAgent,
      //   default_prompt: $i18n.t("webSearchDefaultPrompt"),
    };
  }

  if (msg.tool == "web_search") {
    msg.tool_args = webSearchParams["web_search"];
    msg.type = 100;
  } else if (msg.tool == "arxiv") {
    msg.tool_args = null;
    msg.type = 110;
  }

  const data = Object.assign(
    {},
    //unknow
    // currentModel.value,
    {
      //unknow
      //   openaiApiKey:
      //     $settings.open_api_key_setting === "True" ? openaiApiKey.value : null,
      ...message,
      conversation_id: props.conversation.conversation_id,
      //   frugalMode: frugalMode.value,
    },
    webSearchParams
  );
  const getToken = window.localStorage.getItem("script_pro_token");
  try {
    await fetchEventSource("/api/conversation/", {
      signal: ctrl.value.signal,
      method: "POST",
      headers: {
        accept: "application/json",
        "Accept-Language": window.localStorage.getItem("lang"),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken}`,
      },
      body: JSON.stringify(data),
      openWhenHidden: true,
      onopen(response: Response) {
        if (
          response.ok &&
          response.headers.get("content-type") === EventStreamContentType
        ) {
          return;
        }
        throw new Error(
          `Failed to send message. HTTP ${response.status} - ${response.statusText}`
        );
      },
      onclose() {
        if (ctrl.value.signal.aborted === true) {
          clearInterval(intervalId);
          emits("done", data.conversation_id);
          return;
        }
        throw new Error(
          `Failed to send message. Server closed the connection unexpectedly.`
        );
      },
      onerror(err: any) {
        console.log(err);
        emits("error");
        isWatiing.value = false;
        isThinking.value = false;
        isError.value = true;
        errMsg.value = "Internal Server Error";
        throw err;
      },
      async onmessage(message: any) {
        const event = message.event;
        console.log("event", event);
        const data = JSON.parse(message.data);
        if (event === "error") {
          isError.value = true;
          abortFetch();
          //unknow
          //   showSnackbar(data.error);
          let errObj = JSON.parse(message.data);
          errMsg.value = errObj.errMsg;
          isThinking.value = false;
          commit("index/SET_ERROR_MSG", true);
          emits("done", "err");
          return;
        }

        if (event === "userMessageId") {
          props.conversation.message[props.conversation.message.length - 1].id =
            data.userMessageId;
          return;
        }

        if (event === "done") {
          abortFetch();
          console.log("done.data", data);
          if (data.conversation_id) {
            commit("index/SET_CONVERSION_ID", data.conversation_id);
            props.conversation.conversation_id = data.conversation_id;
          }
          props.conversation.message[props.conversation.message.length - 1].id =
            data.messageId;
          if (!props.conversation.id) {
            props.conversation.id = data.conversationId;
            // genTitle(props.conversation.id);
          }
          return;
        }
        // const newDiv = document.createElement("p");
        // newDiv.setAttribute("class", "blink");
        // let el = document.getElementsByClassName("container-box");
        // el[0].lastChild?.appendChild(newDiv);
        // let el = document.getElementsByClassName("robot");
        // console.log(el)
        console.log("data", data);
        if (data.content) {
          isError.value = false;

          messageQueue.value.push(data.content);
        }
        processMessageQueue();

        scrollChatWindow();
      },
    });
  } catch (err) {
    console.log("err", err);
    abortFetch();
    // showSnackbar(err.message);
  }
};
const sendObject = (message: any) => {
  isThinking.value = true;
  send(message);
  setTimeout(() => {
    let height =
      document.getElementsByClassName("container-box")[0]?.scrollHeight;

    // container.value.scrollTo({ top: height, behavior: "smooth" });
  }, 0);
  scrollToBottom();
};
const handleCleanChat = () => {
  abortFetch();
  messageList.value = [];
  isError.value = false;
  isWatiing.value = false;
};
const handleStopReceive = () => {
  abortFetch();
  isThinking.value = false;
  isWatiing.value = false;
};
emitter.on("openNewChat", handleCleanChat);
emitter.on("sendMessage", sendObject);
emitter.on("stopReceive", handleStopReceive);
emitter.on("stopChat", handleStopReceive);
</script>

<style lang="scss">
@import "../styles/index.scss";
.ref-container {
  position: absolute;
  height: 20px;
  bottom: 0;
  // background-color: red;
  width: 20px;
}
.container-box {
  height: calc(100% - 20px);
  overflow-y: scroll;
}
.people {
  list-style: none;
  padding: 24px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  background-color: #f9f9f9;
  background: #f9f9f9;
  width: calc(100% - 100px);
  margin: 0 auto;
  border-radius: 8px;
}
.robot {
  list-style: none;
  padding-bottom: 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  text-align: left;
  .text_content {
    position: relative;
    overflow: hidden;
    width: 0;
    font-size: 32px;
    line-height: 34px;
    font-family: "Courier New", Courier, monospace;
    white-space: nowrap;
    animation: width 2s steps(13) forwards;
    &::after {
      content: "";
      position: absolute;
      right: Opx;
      height: 32px;
      border-right: 1px solid #000000;
      animation: showInfinite 0.5s infinite both;
    }
  }
}
.robot_content {
  padding: 10px;
  display: inline-block;
}
.thinking {
  margin-top: 15px;
}
.result-streaming:after {
  -webkit-animation: blink 1s steps(5, start) infinite;
  animation: blink 1s steps(5, start) infinite;
  content: "▋";
  margin-left: 0.25rem;
  vertical-align: baseline;
}
</style>