import _axios, { AxiosRequestConfig } from "axios";

const axios = _axios.create({
  baseURL: "/api/",
});

export const post = async <T extends unknown>(
  endpoint: string,
  data?: Record<string, unknown>,
  options?: AxiosRequestConfig
) => {
  const response = await axios.post<T>(endpoint, data, options);
  return response.data;
};
