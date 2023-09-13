import request from "../utils/request";

export enum Api {
    POST_EMAIL = "/api/user/reserve",
}


export const postEmail = (data?: any) => request.post(Api.POST_EMAIL, data);
