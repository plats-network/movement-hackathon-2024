import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { redirect } from "next/navigation";

const logOnDev = (
  message: string,
  log?: AxiosResponse | InternalAxiosRequestConfig | AxiosError
) => {
  if (process.env.NEXT_PUBLIC_API === "development") {
    console.log(message, log);
  }
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,

  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (request) => {
  const { method, url } = request;
  logOnDev(`🚀 [${method?.toUpperCase()}] ${url} | Request`, request);

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    const { method, url } = response.config;
    const { status } = response;

    logOnDev(
      `✨ [${method?.toUpperCase()}] ${url} | Response ${status}`,
      response
    );

    return response;
  },
  async (error) => {
    const { message } = error;
    const { status, data } = error.response;
    const { method, url } = error.config;
    logOnDev(
      `🚨 [${method?.toUpperCase()}] ${url} | Error ${status} ${
        data?.message || ""
      } | ${message}`,
      error
    );

    if (status === 400) {
      redirect("/logout");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
