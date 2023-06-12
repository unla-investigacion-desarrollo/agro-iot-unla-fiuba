import { FetchGridParams } from "../api/shared/FetchService";

export interface GridFilter {
  key: string;
  value: any;
}

export interface GridParams {
  pageSize?: number;
  page?: number;
  sortField?: string;
  sortDirection?: string;
  search?: string;
  filters?: GridFilter[];
}

export const ROWS_PER_PAGE = 10;

export const createBaseGridParams = ({
  pageSize = ROWS_PER_PAGE,
  page = 0,
  sortDirection = "ascend",
  sortField = "",
  filters = [],
}: GridParams): GridParams => {
  return { pageSize, page, sortDirection, sortField, filters };
};

export const transformGridParamsToFetchGridParams = (
  params: GridParams
): FetchGridParams => {
  return {
    page: params.page!,
    pageSize: params.pageSize!,
    sortField: params.sortField!,
    sortDirection: params.sortDirection!,
    search: params.search,
    urlFilters: params
      .filters!.map((item) =>
        item.value instanceof Array
          ? item.value.map((val) => `&${item.key}=${val}`).join("")
          : `&${item.key}=${item.value}`
      )
      .join(""),
  };
};
