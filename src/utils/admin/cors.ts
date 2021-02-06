import { VercelRequest, VercelResponse } from "@vercel/node";
import _cors from "cors";

export const cors = (request: VercelRequest, response: VercelResponse) =>
  new Promise((resolve, reject) => {
    _cors({
      methods: ["GET", "POST", "OPTIONS"],
      origin: ["http://localhost:3000", "https://metaneno.art"],
    })(request, response, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
