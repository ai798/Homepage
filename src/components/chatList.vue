<template>
  <div class="main-box" v-for="(item, index) in list" :key="index">
    <div class="inner">
      <div
        :class="['content', currentId === item.id ? 'active' : '']"
        @click="handleOpenHistory(item)"
      >
        <img src="@/assets/small-icon.png" alt="" />
        <el-input
          v-if="editable && item.id === currentId"
          v-model="topicText"
        ></el-input>
        <p v-else>{{ item.topic }}</p>
      </div>
      <div class="option" v-if="editable">
        <img @click="handleSave('save')" src="@/assets/check.png" alt="" />
        <img @click="handleSave('close')" src="@/assets/close.png" alt="" />
      </div>
      <div class="option" v-else>
        <img
          @click="handleOption('edit', item, index)"
          src="@/assets/edit.png"
          alt=""
        />
        <img
          @click="handleOption('delete', item, index)"
          src="@/assets/delete.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import emitter from "@/utils/mitt";
import { editMessageList, deleteMessageList } from "@/api/index";
const { state, commit, getters } = useStore();
// const currentItem = ref({} as any);
const editable = ref(false);
const currentId = ref();
const topicText = ref("");
const uuid: any = computed(() => window.localStorage.getItem("script_uuid"));
const props = defineProps({
  list: {
    type: Array as any,
    required: true,
  },
});
const currentItem = computed(() => {
  return state.index.currentItem;
});
const handleOpenHistory = (item: any) => {
  // currentItem.value = item;
  currentId.value = item.id;
  console.log(state.index.conversationId);
  commit("index/SET_CURRENT_ITEM", item);
  if (editable.value) return;
  emitter.emit("getHistory", item);
  emitter.emit("stopChat");
};
watch(
  () => editable.value,
  (val, old) => {
    console.log(val, old);
  },
  {
    immediate: true,
    deep: true,
  }
);
const emits = defineEmits(["updateList"]);
const { t, locale } = useI18n();
const open = (index: any) => {
  ElMessageBox.confirm(
    t("asp_desc_delete_chat") + currentItem.value.topic,
    t("asp_title_delete_chat"),
    {
      confirmButtonText: t("asp_btn_delete"),
      cancelButtonText: t("asp_btn_cancel"),
      type: "warning",
    }
  )
    .then(() => {
      deleteMessageList(currentItem.value, uuid.value)
        .then((res) => {
          ElMessage({
            type: "success",
            message: "Delete completed",
          });
        })
        .catch((err) => {
          ElMessage({
            type: "warning",
            message: "Delete unsuccessful",
          });
        })
        .finally(() => {
          if (currentItem.value) {
            if (props.list.length) {
              if (props.list.length - 1 === index) {
                commit("index/SET_CURRENT_ITEM", props.list[index]);
                topicText.value = props.list[index].topic;
              } else if (props.list.length === 1) {
                newChat();
                return;
              } else {
                topicText.value = props.list[index + 1].topic;
                commit("index/SET_CURRENT_ITEM", props.list[index + 1]);
              }
              // currentItem.value = props.list[index + 1];
              if (props.list.length !== 1) {
                handleOpenHistory(currentItem.value);
              }
            }
          }
          emits("updateList");
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};
const handleOption = (op: string, item: any, index: any) => {
  topicText.value = currentItem.value.topic;
  currentId.value = currentItem.value.id;

  commit("index/SET_CURRENT_ITEM", item);
  // currentItem.value = item;
  if (op === "delete") {
    console.log("currentItem.value", currentItem.value);
    open(index);
  } else {
    editable.value = true;
  }
};
const handleSave = (op: string) => {
  if (op === "save") {
    let obj = {
      topic: topicText.value,
      user_name: uuid.value,
    };
    editMessageList(currentItem.value.id, obj)
      .then((res) => {})
      .finally(() => {
        emits("updateList");
        editable.value = false;
      });
  } else {
    editable.value = false;
  }
};
const newChat = () => {
  currentId.value = null;
};
emitter.on("openNewChat", newChat);
</script>

<style lang="scss" scoped>
.main-box {
  width: 201px;
  height: 44px;
  cursor: pointer;
  .active {
    background: #e9edf5;
    border-radius: 8px;
  }
  .inner {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    border-radius: 8px;
    background: #fafafa;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    .option {
      display: none;
      img {
        width: 16px;
        height: 16px;
        margin: 0 8px;
      }
    }
    &:hover {
      background: #e9edf5;
      .option {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }

    .content {
      img {
        width: 16px;
        height: 16px;
        margin: 0 8px;
      }
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      justify-content: flex-start;
    }
  }

  p {
    color: #1a1a1a;
    font-family: Source Code Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100px;
    white-space: nowrap;
  }
}
</style>