import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const createApi = (baseURL: string): AxiosInstance => {
  const api = axios.create({ baseURL });

  // Request Interceptor: gắn token
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response Interceptor: refresh token khi 401
  api.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (token) {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refresh_token = localStorage.getItem("refresh_token");

        if (!refresh_token) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return Promise.reject(error);
        }

        try {
          // 🚨 lưu ý: refresh token luôn gọi sang AUTH service
          const res = await axios.post(
            `${import.meta.env.VITE_AUTH_SERVICE_URL}/auth/refresh`,
            { refresh_token }
          );

          const newAccessToken = res.data?.Data?.access_token;
          if (newAccessToken) {
            localStorage.setItem("access_token", newAccessToken);
            processQueue(null, newAccessToken);

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
          } else {
            throw new Error("Refresh token failed!");
          }
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};


export const userApi = createApi(import.meta.env.VITE_API_USER);
export const apiURL = createApi(import.meta.env.VITE_API_URL);
