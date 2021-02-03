import _axios, { AxiosRequestConfig } from "axios";

const axios = _axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://okusuri.land/api/"
      : "http://localhost:3000/api/",
});

export type ApiResponse<T> = {
  data: T;
};

export const get = async <T extends unknown>(
  endpoint: string,
  options?: AxiosRequestConfig
) => {
  const { data } = await axios.get<T>(endpoint, options);
  return data;
};

export const post = async <T extends unknown>(
  endpoint: string,
  data?: Record<string, unknown>,
  options?: AxiosRequestConfig
) => {
  const response = await axios.post<T>(endpoint, data, options);
  return response.data;
};
