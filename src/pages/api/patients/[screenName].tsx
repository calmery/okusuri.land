import { PrismaClient } from "@prisma/client";
import { VercelRequest, VercelResponse } from "@vercel/node";

// Prisma

const prisma = new PrismaClient();

// CRUD

const get = async (request: VercelRequest, response: VercelResponse) => {
  const screenName = request.query.screenName as string;

  if (!screenName.startsWith("@")) {
    return response.status(400).end();
  }

  const userProfile = await prisma.userProfile.findFirst({
    include: { medicines: true },
    orderBy: {
      // Twitter の screen_name の変更によって既存の UserProfile と screen_name が重複する可能性がある
      // 重複自体に問題はないため、レコードが複数存在する場合を考慮して updatedAt を降順でソートする
      // 過去にログインして、screen_name を変更した人はもう一度ログインし直すことで新しい screen_name に更新される
      updatedAt: "desc",
    },
    where: {
      screenName: {
        equals: screenName.slice(1),
      },
    },
  });

  if (!userProfile) {
    return response.status(404).end();
  }

  response.send({
    data: {
      id: userProfile.id,
      image: userProfile.image,
      medicines: userProfile.medicines.map(({ medicineId }) => medicineId),
      name: userProfile.name,
      screenName: userProfile.screenName,
    },
  });
};

// Main

export default (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case "GET":
      return get(request, response);

    default:
      return response.status(404).end();
  }
};
