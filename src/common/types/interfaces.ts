export enum SortDirections {
  asc = 'asc',
  desc = 'desc',
}
export interface InputQueryParams {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirections;
  pageNumber?: string;
  pageSize?: string;
}

export interface QueryParamsDTO {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
}
