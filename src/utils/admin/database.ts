import { PatientPhysicalCondition, PrismaClient } from "@prisma/client";
import { Sentry } from "../sentry";
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
    await prisma.$connect();
    await prisma.$transaction(transactions);

    return true;
  } catch (error) {
    Sentry.captureException(error);

    return false;
  } finally {
    await prisma.$disconnect();
  }
};

// Main

export const getPatientDiseases = async (
  departmentId: DepartmentId,
  patientId: string
) => {
  await prisma.$connect();

  const patientDiseases = await prisma.patientDisease.findMany({
    where: {
      departmentId,
      patientId,
    },
  });

  await prisma.$disconnect();

  return patientDiseases;
};

export const getPatientPhysicalCondition = async (
  departmentId: DepartmentId,
  patientId: string
) => {
  await prisma.$connect();

  const physicalCondition = await prisma.patientPhysicalCondition.findFirst({
    where: {
      departmentId,
      patientId,
    },
  });

  await prisma.$disconnect();

  return physicalCondition;
};

export const getPatientRecordByPatientId = async (patientId: string) => {
  await prisma.$connect();

  const patientRecord = await prisma.patientRecord.findFirst({
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

  await prisma.$disconnect();

  return patientRecord;
};

export const getPatientRecordByScreenName = async (screenName: string) => {
  await prisma.$connect();

  const patientRecord = await prisma.patientRecord.findFirst({
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

  await prisma.$disconnect();

  return patientRecord;
};

export const isPatientExists = async (patientId: string) => {
  await prisma.$connect();

  const patient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  });

  await prisma.$disconnect();

  return !!patient;
};

export const upsertPatient = async (
  patientId: string,
  patientInsuranceCard: PatientInsuranceCard
) => {
  await prisma.$connect();

  const patient = await prisma.patient.upsert({
    where: {
      id: patientId,
    },
    update: patientInsuranceCard,
    create: {
      ...patientInsuranceCard,
      id: patientId,
    },
  });

  await prisma.$disconnect();

  return patient;
};

export const createPatientDisease = async (
  departmentId: DepartmentId,
  patientId: string,
  diseaseId: DiseaseId
) => {
  await prisma.$connect();

  const patientDisease = await prisma.patientDisease.create({
    data: {
      departmentId,
      diseaseId,
      patientId,
    },
  });

  await prisma.$disconnect();

  return patientDisease;
};

export const upsertPatientPhysicalCondition = async (
  departmentId: DepartmentId,
  patientId: string,
  json: Record<string, number>
) => {
  await prisma.$connect();

  const id = (
    await prisma.patientPhysicalCondition.findFirst({
      where: {
        departmentId,
        patientId,
      },
    })
  )?.id;

  let physicalCondition: PatientPhysicalCondition;

  if (id) {
    physicalCondition = await prisma.patientPhysicalCondition.update({
      where: {
        id,
      },
      data: {
        json,
      },
    });
  } else {
    physicalCondition = await prisma.patientPhysicalCondition.create({
      data: {
        departmentId,
        json,
        patientId,
      },
    });
  }

  await prisma.$disconnect();

  return physicalCondition;
};

export const upsertPatientRecord = async (
  patientId: string,
  patientRecord: Omit<PatientRecord, "diseases">
) => {
  await prisma.$connect();

  const nextPatientRecord = await prisma.patientRecord.upsert({
    where: {
      patientId,
    },
    create: {
      ...patientRecord,
      patientId,
    },
    update: patientRecord,
  });

  await prisma.$disconnect();

  return nextPatientRecord;
};
