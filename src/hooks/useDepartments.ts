import useSWR from "swr";
import { Department } from "~/types/Department";
import { ApiResponse, get } from "~/utils/api";

const getDepartments = async () => {
  const { data } = await get<ApiResponse<{ departments: Department[] }>>(
    "/departments"
  );

  return data;
};

export const useDepartments = () => {
  const { data, error } = useSWR<{ departments: Department[] }, Error>(
    "/departments",
    getDepartments
  );

  return { departments: data?.departments, error };
};
