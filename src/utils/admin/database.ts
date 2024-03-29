import { Prisma, PrismaClient } from "@prisma/client";
import { Sentry } from "../sentry";
import { GraphCmsDepartmentId, GraphCmsDiseaseId } from "~/types/GraphCMS";
import { PatientInsuranceCard } from "~/types/PatientInsuranceCard";

export const prisma = new PrismaClient();

const db = async <T extends any>(
  fn: (prisma: PrismaClient<Prisma.PrismaClientOptions, never>) => Promise<T>
) => {
  try {
    await prisma.$connect();
    const result = await fn(prisma);
    await prisma.$disconnect();
    return result;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
};

// Helper Functions

export const transaction = (
  transactions: Parameters<typeof prisma.$transaction>[0]
) =>
  db(async (prisma) => {
    try {
      await prisma.$transaction(transactions);
      return true;
    } catch (error) {
      Sentry.captureException(error);
      return false;
    }
  });

// Main

export const getPatientDiseases = (
  patientId: string,
  departmentId?: GraphCmsDepartmentId
) =>
  db((prisma) =>
    prisma.patientDisease.findMany({
      where: {
        departmentId,
        patientId,
      },
    })
  );

export const getPatientPhysicalCondition = (
  departmentId: GraphCmsDepartmentId,
  patientId: string
) =>
  db((prisma) =>
    prisma.patientPhysicalCondition.findFirst({
      where: {
        departmentId,
        patientId,
      },
    })
  );

export const getPatientRecordByPatientId = (patientId: string) =>
  db((prisma) =>
    prisma.patientRecord.findFirst({
      orderBy: {
        // Twitter の screen_name の変更によって既存の PatientRecord と screen_name が重複する可能性がある
        // 重複自体に問題はないため、レコードが複数存在する場合を考慮して updatedAt を降順でソートする
        // 過去にログインして、screen_name を変更した人はもう一度ログインし直すことで新しい screen_name に更新される
        updatedAt: "desc",
      },
      where: {
        patientId: {
          equals: patientId,
        },
      },
    })
  );

export const getPatientRecordByScreenName = (screenName: string) =>
  db((prisma) =>
    prisma.patientRecord.findFirst({
      orderBy: {
        // Twitter の screen_name の変更によって既存の PatientRecord と screen_name が重複する可能性がある
        // 重複自体に問題はないため、レコードが複数存在する場合を考慮して updatedAt を降順でソートする
        // 過去にログインして、screen_name を変更した人はもう一度ログインし直すことで新しい screen_name に更新される
        updatedAt: "desc",
      },
      where: {
        screenName: {
          equals: screenName,
        },
      },
    })
  );

export const isPatientExists = (patientId: string) =>
  db(async (prisma) => {
    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    return !!patient;
  });

export const upsertPatientPhysicalCondition = (
  departmentId: GraphCmsDepartmentId,
  patientId: string,
  json: Record<string, number>
) =>
  db(async (prisma) => {
    const id = (
      await prisma.patientPhysicalCondition.findFirst({
        where: {
          departmentId,
          patientId,
        },
      })
    )?.id;

    if (!id) {
      return prisma.patientPhysicalCondition.create({
        data: {
          departmentId,
          json,
          patientId,
        },
      });
    }

    return prisma.patientPhysicalCondition.update({
      where: {
        id,
      },
      data: {
        json,
      },
    });
  });

// `transaction` 関数に渡すため `$connect` や `$disconnect` を呼んではならない

export const upsertPatient = (
  patientId: string,
  patientInsuranceCard: PatientInsuranceCard
) =>
  prisma.patient.upsert({
    where: {
      id: patientId,
    },
    update: patientInsuranceCard,
    create: {
      ...patientInsuranceCard,
      id: patientId,
    },
  });

export const createPatientDisease = (
  departmentId: GraphCmsDepartmentId,
  patientId: string,
  diseaseId: GraphCmsDiseaseId
) =>
  prisma.patientDisease.create({
    data: {
      departmentId,
      diseaseId,
      patientId,
    },
  });

export const upsertPatientRecord = (
  patientId: string,
  patientRecord: {
    id: string;
    image: string;
    name: string;
    screenName: string;
  }
) =>
  prisma.patientRecord.upsert({
    where: {
      patientId,
    },
    create: {
      ...patientRecord,
      patientId,
    },
    update: patientRecord,
  });
