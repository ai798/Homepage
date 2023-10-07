<template>
  <div class="main-box" v-for="(item, index) in list" :key="index">
    <div class="inner">
      <div class="content" @click="handleOpenHistory(item)">
        <img src="@/assets/small-icon.png" alt="" />
        <el-input v-if="editable && item.id === currentItem.id" v-model="topicText"></el-input>
        <p v-else>{{ item.topic }}</p>
      </div>
      <div class="option" v-if="editable">
        <img @click="handleSave('save')" src="@/assets/check.png" alt="" />
        <img @click="handleSave('close')" src="@/assets/close.png" alt="" />
      </div>
      <div class="option" v-else>
        <img
          @click="handleOption('edit', item)"
          src="@/assets/edit.png"
          alt=""
        />
        <img
          @click="handleOption('delete', item)"
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
import { ref, computed } from "vue";
import emitter from "@/utils/mitt";
import {
  editMessageList,
  deleteMessageList,
  getChatHistory,
} from "@/api/index";
const currentItem = ref({} as any);
const editable = ref(false);
const topicText = ref("");
const uuid: any = computed(() => window.localStorage.getItem("script_uuid"));
const props = defineProps({
  list: {
    type: Array as any,
    required: true,
  },
});
const handleOpenHistory = (item: any) => {
  emitter.emit("getHistory", item);
};
const emits = defineEmits(["updateList"]);
const { t, locale } = useI18n();
const open = () => {
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
const handleOption = (op: string, item: any) => {
  currentItem.value = item;
  topicText.value = currentItem.value.topic;
  if (op === "delete") {
    open();
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
</script>

<style lang="scss" scoped>
.main-box {
  width: 201px;
  height: 44px;
  cursor: pointer;

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
      justify-content: center;
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