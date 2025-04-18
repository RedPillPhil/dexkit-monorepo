import { DexkitApiProvider } from "@dexkit/core/providers";
import { GridSortModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ProductFormType } from "../types";

export const GET_PRODUCT_LIST = "GET_PRODUCT_LIST";

export default function useProductList(params: {
  page: number;
  limit: number;
  q?: string;
  sortModel?: GridSortModel;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_PRODUCT_LIST, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      const newParams: any = { ...params };

      for (const sort of params?.sortModel ?? []) {
        newParams[sort.field] = sort.sort;
      }

      delete newParams["sortModel"];

      return (
        await instance.get<{
          items: ProductFormType[];
          totalItems: number;
          totalPages: number;
          currentPage: number;
        }>("/products", { params: newParams })
      ).data;
    },
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      staleTime: 1000,
    }
  );
}
