import redis from "redis";

const client = redis.createClient({
  url: process.env.REDIS_URL!,
});

export const get = (key: string): Promise<string | null> =>
  new Promise((resolve, reject) =>
    client.get(key, (error, value) => {
      if (error) {
        return reject(error);
      }

      return resolve(value);
    })
  );

export const key = (...keys: string[]): string => keys.join("_");

export const set = (key: string, value: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const newValue = JSON.stringify(value);

    client.set(key, newValue, "EX", 3600, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve(newValue);
    });
  });

export const setnx = async (key: string, fetcher: () => Promise<any>) => {
  if (process.env.NODE_ENV !== "production") {
    return JSON.stringify(await fetcher());
  }

  const value = await get(key);

  if (value) {
    return value;
  }

  return set(key, await fetcher());
};
