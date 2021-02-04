import { request as _request } from "graphql-request";

export const request = async <T extends unknown>(query: string): Promise<T> =>
  _request(process.env.GRAPHCMS_URL!, query);
