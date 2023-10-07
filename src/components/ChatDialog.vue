<template>
  <div ref="grab" class="container-box">
    <div ref="container">
      <div v-for="(item, index) in messageList" :key="index">
        <div v-if="item.message_type === 0" class="people">
          <span class="people_text">{{ item.content }}</span>
        </div>

        <div v-else-if="item.message_type === 1" class="robot">
          <v-md-preview :text="item.content"></v-md-preview>

          <!-- <span class="robot_content">{{ item.content }}</span> -->
        </div>
        <div v-else class="error">
          {{ item.content }}
        </div>
      </div>
      <div class="thinking" v-show="isWatiing">
        {{ $t("asp_status_thinking") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sendMessage } from "@/api/index";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { reactive, ref, unref, watch } from "vue";
import emitter from "@/utils/mitt";
const fetchingResponse = ref(false);
const isWatiing = ref(false);
const grab = ref(null as any);
let ctrl = ref(null as any);
const editor = ref(null as any);
const messageQueue = [];
const messageList = ref([] as any);
let webSearchParams = {} as any;
const enableWebSearch = ref(false);
const props = defineProps({
  conversation: {
    type: Object as any,
    required: true,
  },
});
const emits = defineEmits(["done"]);
watch(
  props.conversation,
  (e) => {
    if (e) {
      console.log("props.conversation", props.conversation);
      messageList.value = [...props.conversation.message];
    }
  },
  { immediate: true }
);
const send = (message: any) => {
  fetchingResponse.value = true;
  messageList.value.push(...message.message);
  console.log(messageList.value);
  isWatiing.value = true;
  if (props.conversation.messages) {
    // unknow
    // addConversation(props.conversation);
  }
  //   if (Array.isArray(message)) {
  //     props.conversation.message.push(
  //       ...message.map((i) => ({
  //         message: i.content,
  //         message_type: i.message_type,
  //       }))
  //     );
  //   } else {
  //     props.conversation.message.push({
  //       message: message.content,
  //       message_type: message.message_type,
  //     });
  //   }
  //   fetchReply(message);
  sendMessage(message)
    .then((res: any) => {
      console.log(res);
      let response = {};
      if (res.payload) {
        response = {
          ...res.payload,
          message_type: 1,
        };
      } else {
        response = {
          content: res.errMsg,
          message_type: 2, //错误,
        };
      }
      messageList.value.push(response);
    })
    .catch(() => {})
    .finally(() => {
      emits("done");
      isWatiing.value = false;
    });
  scrollChatWindow();
};
const scrollChatWindow = () => {
  if (grab.value === null) {
    return;
  }
  grab.value.scrollIntoView({ behavior: "smooth" });
};
const abortFetch = () => {
  if (ctrl) {
    ctrl.abort();
  }
  fetchingResponse.value = false;
};

const fetchReply = async (message: any) => {
  ctrl = new AbortController();

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
      conversationId: props.conversation.id,
      //   frugalMode: frugalMode.value,
    },
    webSearchParams
  );

  try {
    await fetchEventSource("/api/conversation/", {
      signal: ctrl.signal,
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      openWhenHidden: true,
      onopen(response: Response) {
        if (
          response.ok &&
          response.headers.get("content-type") === EventStreamContentType
        ) {
          console.log("response", response);
          return;
        }
        throw new Error(
          `Failed to send message. HTTP ${response.status} - ${response.statusText}`
        );
      },
      onclose() {
        if (ctrl.signal.aborted === true) {
          return;
        }
        throw new Error(
          `Failed to send message. Server closed the connection unexpectedly.`
        );
      },
      onerror(err: any) {
        throw err;
      },
      async onmessage(message: any) {
        const event = message.event;
        const data = JSON.parse(message.data);

        if (event === "error") {
          abortFetch();
          //unknow
          //   showSnackbar(data.error);
          return;
        }

        if (event === "userMessageId") {
          props.conversation.message[props.conversation.message.length - 1].id =
            data.userMessageId;
          return;
        }

        if (event === "done") {
          abortFetch();
          props.conversation.message[props.conversation.message.length - 1].id =
            data.messageId;
          if (!props.conversation.id) {
            props.conversation.id = data.conversationId;
            // genTitle(props.conversation.id);
          }
          if (data.newDocId) {
            editor.value.refreshDocList();
          }
          return;
        }

        messageQueue.push(data.content);
        // processMessageQueue();

        scrollChatWindow();
      },
    });
  } catch (err) {
    console.log(err);
    abortFetch();
    // showSnackbar(err.message);
  }
};
const sendObject = (message: any) => {
  send(message);
};
emitter.on("sendMessage", sendObject);
</script>

<style lang="scss" scoped>
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
  width: calc(100% - 250px);
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
}
.robot_content {
  padding: 10px;
  display: inline-block;
}
.thinking {
  margin-top: 15px;
}
</style>