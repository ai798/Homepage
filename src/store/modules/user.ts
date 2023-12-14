import { defineStore } from "pinia";
import store from "../index";
import { login } from "@/api";

interface UserState {
  token: string;
  userInfo: any;
}

interface LoginParams {
  username: string;
  password: string;
}

export const useUserStore = defineStore({
  id: "user",
  persist: true,
  state: (): UserState => ({
    token: "",
    userInfo: {},
  }),
  getters: {
    getToken: (state: any) => state.token,
  },
  mutations: {
    SET_TOKEN(state: any, data: any) {
      state.token = data;
    },
    SET_USER_INFO(state: any, data: any) {
      state.userInfo = data;
    },
  },
  actions: {
    async login(params: LoginParams, { commit }: any) {
      const res = await login(params);
      console.log("login,res", res);
      commit("index/SET_CHAT_LIST", res.data);
      // await this.getUserInfo();
      // await this.addLoginLog();
    },

    // logout(router: Router) {
    //     storeReset();
    //     resetRouter();
    //     const { currentRoute } = router;
    //     router.replace({
    //         path: "/login",
    //         query: {
    //             redirect: currentRoute.value.path
    //         }
    //     });
    // },

    // async getUserInfo() {
    //     if (!this.token) return;
    //     const res = await getUserInfo();
    //     this.setRoleId(res.data.roleIds);
    //     this.setUserInfo(res.data);
    // },

    // async addLoginLog() {
    //     await addLoginInfo({
    //         username: this.userInfo.username
    //     });
    // },

    // async changeRole(role: string) {
    //     storeReset();
    //     resetRouter();
    //     let params: any = {};
    //     if (role === "admin") {
    //         params = { username: "admin", password: 123456 };
    //     } else {
    //         params = { username: "test", password: 123456 };
    //     }
    //     await this.login(params);
    //     const usePermission = usePermissionStore();
    //     usePermission.changeRole();
    // }
  },
});

// 便于外部使用
export const useUserStoreWithOut = () => {
  return useUserStore(store);
};
