import axios, { AxiosInstance } from "axios";
import { signOut } from "next-auth/react";
import { refreshTokenService } from ".";
import { ENVIRONMENT } from "../configurations/index";
import { AxiosResponse } from "./types";

const cdnRequest: AxiosInstance = axios.create({
  baseURL: ENVIRONMENT.baseURL,
});

const ApiRequest: AxiosInstance = axios.create({
  baseURL: ENVIRONMENT.baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshTokenInstance: AxiosInstance = axios.create({
  baseURL: ENVIRONMENT.baseURL,
});

const refreshTokenRequestManager = [
  (config: any) => {
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
];

const handlePendingRequests = () => {
  if (typeof window !== "undefined") {
    window.location.reload();
  }
};

/** interceptors */

export const requestManager = [
  (config: any) => {
    if (typeof window !== "undefined") {
      const authToken = window.localStorage.getItem("token");
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
];
export const responseManager = [
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    if (
      // (error?.response?.status === 401 || error?.response?.status === 403)
      error?.response?.status === 401 &&
      !originalRequest.__isRetryRequest &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("isRefreshTokenProgress") !== "true"
    ) {
      originalRequest.__isRetryRequest = true;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("isRefreshTokenProgress", "true");
      }

      const refresh_token = window.localStorage.getItem("refreshToken");
      const form = {
        refreshToken: refresh_token ? refresh_token : "",
      };

      try {
        const response: AxiosResponse = await refreshTokenService(form);
        localStorage.setItem("token", response?.data?.data?.token);
        localStorage.setItem(
          "refreshToken",
          response?.data?.data?.refreshToken
        );
        if (typeof window !== "undefined") {
          window.localStorage.setItem("isRefreshTokenProgress", "false");
        }
        originalRequest.headers.Authorization = `Bearer ${response?.data?.data?.token}`;
        return ApiRequest(originalRequest);
      } catch (err: any) {
        localStorage.setItem("401Info", "true");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("permissions");
        if (typeof window !== "undefined") {
          window.localStorage.setItem("isRefreshTokenProgress", "false");
        }
        setTimeout(() => {
          signOut();
        }, 3000);
      }
    }
    return Promise.reject(error);
  },
];

refreshTokenInstance.interceptors.request.use(...refreshTokenRequestManager);
ApiRequest.interceptors.request.use(...requestManager);
ApiRequest.interceptors.response.use(...responseManager);

export { cdnRequest, ApiRequest, refreshTokenInstance };
