import request from "@/utils/index";

export enum Api {
  POST_EMAIL = "/api/user/reserve",
  TEST_POST = "/post_email",
  SEND_MESSAGE = "/api/conversation/",
  CHAT_LIST = "/api/chat/conversations",
  CHAT_HISTORY = `/api/chat/messages`,
  OPTION_MESSAGELIST = "/api/chat/conversations",
  SEND_CODE = "/api/user/verifycode",
  REGISTER = "/api/user/register",
  LOGIN = "/api/user/login",
  RESET = "/api/user/reset",
  GET_PROFILE = "/api/user/profile",
}

export const postEmail = (data?: any) => request.post(Api.POST_EMAIL, data);
export const postTest = (data?: any) => request.post(Api.TEST_POST, data);
export const sendMessage = (data?: any) => request.post(Api.SEND_MESSAGE, data);
export const sendCode = (data?: any) => request.post(Api.SEND_CODE, data);
export const register = (data?: any) => request.post(Api.REGISTER, data);
export const login = (data?: any) => request.post(Api.LOGIN, data);
export const reset = (data?: any) => request.post(Api.RESET, data);
export const getChatList = (params?: any) => request.get(Api.CHAT_LIST);
export const getProfile = (params?: any) => request.get(Api.GET_PROFILE);
export const getChatHistory = (params?: any) =>
  request.get(Api.CHAT_HISTORY + "?conversation_id=" + params);
export const editMessageList = (id: any, data?: any) =>
  request.put(Api.OPTION_MESSAGELIST + `/${id}/`, data);
export const deleteMessageList = (data?: any, uuid?: any) =>
  request.delete(Api.OPTION_MESSAGELIST + `/${data.id}/`, { user_name: uuid });
