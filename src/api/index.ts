import request from "@/utils/index";

export enum Api {
  POST_EMAIL = "/api/user/reserve",
  TEST_POST = "/post_email",
  SEND_MESSAGE = "/api/conversation/",
  CHAT_LIST = "/api/chat/conversations?user_name=",
  CHAT_HISTORY = `/api/chat/messages`,
  OPTION_MESSAGELIST = "/api/chat/conversations",
}

export const postEmail = (data?: any) => request.post(Api.POST_EMAIL, data);
export const postTest = (data?: any) => request.post(Api.TEST_POST, data);
export const sendMessage = (data?: any) => request.post(Api.SEND_MESSAGE, data);
export const getChatList = (params?: any) =>
  request.get(Api.CHAT_LIST + params);
export const getChatHistory = (params?: any) =>
  request.get(
    Api.CHAT_HISTORY +
      "?user_name=" +
      params[0] +
      "&conversationId=" +
      params[1]
  );
export const editMessageList = (id: any, data?: any) =>
  request.put(Api.OPTION_MESSAGELIST + `/${id}/`, data);
export const deleteMessageList = (data?: any, uuid?: any) =>
  request.delete(Api.OPTION_MESSAGELIST + `/${data.id}/`, { user_name: uuid });
