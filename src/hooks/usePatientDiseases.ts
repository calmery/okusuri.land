import useSWR from "swr";
import { Department } from "~/types/Department";
import { ApiResponse, get } from "~/utils/api";

const getDepartments = async () => {
  const { data } = await get<ApiResponse<Department[]>>("/departments");

  return data;
};

export const useDepartments = () => {
  const { data, error } = useSWR<Department[], Error>(
    "/departments",
    getDepartments
  );

  return { departments: data, error };
};
