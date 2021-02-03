export const parse = <T extends unknown>(body: string): T | null => {
  try {
    return JSON.parse(body) as T;
  } catch (_) {
    return null;
  }
};
