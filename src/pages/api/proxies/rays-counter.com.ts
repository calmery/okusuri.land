import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { cors } from "~/utils/admin/cors";

// CRUD

const get = async (_: VercelRequest, response: VercelResponse) => {
  const { data } = await axios.get(
    "http://www.rays-counter.com/d478_f6_244/602819a5c30fb/",
    {
      headers: { "Content-Type": "image/png" },
      responseType: "arraybuffer",
    }
  );

  response.send(data);
};

// Serverless Functions

export default async (request: VercelRequest, response: VercelResponse) => {
  await cors(request, response);

  switch (request.method) {
    case "GET":
      return get(request, response);

    default:
      return response.status(405).end();
  }
};
