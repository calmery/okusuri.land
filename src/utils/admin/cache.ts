// import redis from "redis";

// const client = redis.createClient({
//   url: process.env.REDIS_URL!,
// });

// client.on("error", console.error);

export const get = (_: string): Promise<string | null> =>
  new Promise(
    (_, reject) => reject()
    // client.get(key, (error, value) => {
    //   if (error) {
    //     return reject(error);
    //   }

    //   return resolve(value);
    // })
  );

export const key = (...keys: string[]): string => keys.join("_");

export const set = (_: string, value: any): Promise<string> =>
  new Promise((resolve, _) => {
    const newValue = JSON.stringify(value);

    // client.set(key, newValue, "EX", 3600, (error) => {
    //   if (error) {
    //     return reject(error);
    //   }

    //   return resolve(newValue);
    // });

    return resolve(newValue);
  });

export const setnx = async (_: string, fetcher: () => Promise<any>) => {
  return JSON.stringify(await fetcher());

  // if (process.env.NODE_ENV !== "production") {
  //   return JSON.stringify(await fetcher());
  // }

  // const value = await get(key);

  // if (value) {
  //   return value;
  // }

  // return set(key, await fetcher());
};
