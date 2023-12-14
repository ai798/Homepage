import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";
import { useEnv } from "@/hooks";
import { ResultEnum, ContentTypeEnum } from "@/enums/httpEnum";
import { setErrorMessage } from "./log";
import { unref } from "vue";
import { ElMessage } from "element-plus";
interface axiosConfig {
  successMessage?: boolean;
  errorMessage?: boolean;
  cancelSame?: boolean;
  retryCount?: number;
  isRetry?: boolean;
  loading?: boolean;
}

const defaultConfig: axiosConfig = {
  successMessage: false,
  errorMessage: true,
  cancelSame: false,
  isRetry: false,
  retryCount: 3,
  loading: true,
};

const { VITE_BASE_API } = useEnv();

const service: AxiosInstance = axios.create({
  baseURL: VITE_BASE_API,
  timeout: 10 * 60 * 1000, // 请求超时时间
  headers: { "Content-Type": ContentTypeEnum.JSON },
});

service.interceptors.request.use((config) => {
  const getToken = window.localStorage.getItem("script_pro_token");
  console.log("getToken", getToken);
  // @ts-ignore
  const { cancelSame, loading } = config.requestOptions;

  if (getToken) {
    config!.headers!.Authorization = unref(`Bearer ${getToken}`) ?? "";
  }

  return config;
});

service.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(response.status);
    const data = response.data;
    if (response && response.status === ResultEnum.SUCCESS) {
      // addAjaxLog(response);
      return Promise.resolve(data);
    }
    if (
      response.status === ResultEnum.NOLOGIN ||
      response.status === ResultEnum.EXPIRE
    ) {
      console.log("123123");
      ElMessage.error({
        customClass: "error",
        message: "No log in",
      });
      setTimeout(() => {
        window.location.replace("/");
      },1500);
      return Promise.reject(response);
    } else {
      // addAjaxErrorLog(response, data.message);
      return Promise.reject(response);
    }
  },
  (err) => {
    if (err.code === "ERR_CANCELED") return;

    setErrorMessage(err.response);
    return Promise.reject(err.response);
  }
);

const request = {
  get<T = any>(url: string, data?: any, config?: axiosConfig): Promise<T> {
    return request.request("GET", url, { params: data }, config);
  },
  post<T = any>(url: string, data?: any, config?: axiosConfig): Promise<T> {
    return request.request("POST", url, { data }, config);
  },
  put<T = any>(url: string, data?: any, config?: axiosConfig): Promise<T> {
    return request.request("PUT", url, { data }, config);
  },
  delete<T = any>(url: string, data?: any, config?: axiosConfig): Promise<T> {
    return request.request("DELETE", url, { data }, config);
  },
  request<T = any>(
    method = "GET",
    url: string,
    data?: any,
    config?: axiosConfig
  ): Promise<T> {
    const options = Object.assign({}, defaultConfig, config);
    return new Promise((resolve, reject) => {
      service({ method, url, ...data, requestOptions: options })
        .then((res) => {
          console.log("res", res);
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        })
        .finally(() => {});
    });
  },
};

export default request;
