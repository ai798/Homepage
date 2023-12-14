/* eslint-disable no-use-before-define */
import { createStore, Store } from "vuex";
import { getChatList } from "@/api/index";
import { login } from "@/api";
import { ElMessage } from "element-plus";
const userId = window.localStorage.getItem("script_uuid");
const index = {
  namespaced: true,
  state: () => ({
    userInfo: null, // 用户个人信息
    topicList: [], //聊天列表
    conversationId: null,
    isError: false,
    token: "",
    currentItem: {},
  }),
  getters: {
    getTopicList: (state: any) => state.topicList,
    getConversionId: (state: any) => state.conversationId,
    getToken: (state: any) => state.token,
    getIsError: (state: any) => state.isError,
    getCurrentItem: (state: any) => state.currentItem,
  },
  mutations: {
    SET_CHAT_LIST(state: any, data: any) {
      state.topicList = data;
    },
    SET_CONVERSION_ID(state: any, data: any) {
      console.log("data-id>", data);
      state.conversationId = data;
    },
    SET_CURRENT_ITEM(state: any, data: any) {
      console.log("data-id>", data);
      state.currentItem = data;
    },
    SET_TOKEN(state: any, data: any) {
      state.token = data;
    },
    SET_USER_INFO(state: any, data: any) {
      state.userInfo = data;
    },

    SET_ERROR_MSG(state: any, data: any) {
      state.isError = data;
    },
  },
  actions: {
    // 获取聊天列表
    async getChatList({ commit }: any) {
      try {
        const data = await getChatList(userId);
        commit("SET_CHAT_LIST", data);
      } catch (e: any) {
        console.error(e);
      }
    },
    async initData() {
      try {
        store.dispatch("index/getChatList");
      } catch (e) {
        console.log(e);
      }
    },
    async login({ commit }: any, params: any) {
      console.log("params", params);
      const res = await login(params);
      if (res.errCode) {
        ElMessage.error({
          customClass: "error",
          message: res.errMsg,
        });
        return;
      }
      if (res.payload.token.access) {
        window.location.replace(
          window.location.href.slice(0, window.location.href.lastIndexOf("/")) +
            "/chat"
        );
        window.localStorage.setItem(
          "script_pro_token",
          res.payload.token.access
        );
        commit("SET_TOKEN", res.payload.token.access);
      }
      // await this.getUserInfo();
      // await this.addLoginLog();
    },
  },
};

const store = createStore({
  modules: {
    index,
  },
});

export default store;
