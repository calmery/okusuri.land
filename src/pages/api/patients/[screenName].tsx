import { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "~/utils/admin";

// CRUD

const get = async ({ query }: VercelRequest, response: VercelResponse) => {
  const patientRecord = await prisma.patientRecord.findFirst({
    include: { diseases: true },
    orderBy: {
      // Twitter の screen_name の変更によって既存の PatientRecord と screen_name が重複する可能性がある
      // 重複自体に問題はないため、レコードが複数存在する場合を考慮して updatedAt を降順でソートする
      // 過去にログインして、screen_name を変更した人はもう一度ログインし直すことで新しい screen_name に更新される
      updatedAt: "desc",
    },
    where: {
      screenName: {
        equals: query.screenName as string,
      },
    },
  });

  if (!patientRecord) {
    return response.status(404).end();
  }

  response.send({
    data: {
      id: patientRecord.id,
      image: patientRecord.image,
      diseases: patientRecord.diseases.map(({ diseaseId }) => diseaseId),
      name: patientRecord.name,
      screenName: patientRecord.screenName,
    },
  });
};

// Main

export default (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case "GET":
      return get(request, response);

    default:
      return response.status(405).end();
  }
};
