import { VercelRequest, VercelResponse } from "@vercel/node";
import _cors from "cors";

const methods = ["GET", "OPTIONS", "POST"];
const origin = ["https://metaneno.art"];

export const cors = (request: VercelRequest, response: VercelResponse) =>
  new Promise((resolve, reject) => {
    _cors({ methods, origin })(request, response, (error?: Error) => {
      if (error) {
        return reject(error);
      }

      return resolve(error);
    });
  });
