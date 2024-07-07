export enum SortDirections {
  asc = 'asc',
  desc = 'desc',
}
export interface QueryParams {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
}
