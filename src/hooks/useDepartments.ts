import useSWR from "swr";
import { ResponseableDepartment } from "~/types/Responseable";
import { ApiResponse, get } from "~/utils/api";

const getDepartments = async () => {
  const { data } = await get<ApiResponse<ResponseableDepartment[]>>(
    "/departments"
  );

  return data;
};

export const useDepartments = () => {
  const { data, error } = useSWR<ResponseableDepartment[], Error>(
    "/departments",
    getDepartments
  );

  return { departments: data, error };
};
