import { PrismaClient } from "@prisma/client";
import {
  PatientInsuranceCard,
  PatientRecord,
} from "~/domains/authentication/models";
import { DepartmentId } from "~/types/Department";
import { DiseaseId } from "~/types/Disease";

export const prisma = new PrismaClient();

// Helper Functions

export const transaction = async (
  transactions: Parameters<typeof prisma.$transaction>[0]
) => {
  try {
    await prisma.$transaction(transactions);

    return true;
  } catch (error) {
    // ToDo: Sentry にエラーを送信する

    return false;
  }
};

// Main

export const getPatientDiseases = async (
  departmentId: DepartmentId,
  patientRecordId: string
) =>
  prisma.patientDisease.findMany({
    where: {
      departmentId,
      patientRecordId,
    },
  });

export const getPatientPhysicalCondition = async (
  departmentId: DepartmentId,
  patientId: string
) =>
  prisma.patientPhysicalCondition.findFirst({
    where: {
      departmentId,
      patientId,
    },
  });

export const getPatientRecordByPatientId = (patientId: string) =>
  prisma.patientRecord.findFirst({
    include: { diseases: true },
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
  });

export const getPatientRecordByScreenName = (screenName: string) =>
  prisma.patientRecord.findFirst({
    include: { diseases: true },
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
  });

export const isPatientExists = async (patientId: string) =>
  !!(await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  }));

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
  departmentId: DepartmentId,
  patientRecordId: string,
  diseaseId: DiseaseId
) =>
  prisma.patientDisease.create({
    data: {
      departmentId,
      diseaseId,
      patientRecordId,
    },
  });

export const upsertPatientPhysicalCondition = async (
  departmentId: DepartmentId,
  patientId: string,
  json: Record<string, number>
) => {
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
};

export const upsertPatientRecord = (
  patientId: string,
  patientRecord: Omit<PatientRecord, "diseases">
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
