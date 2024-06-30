export interface BlogInputBody {
  name: string;
  description: string;
  websiteUrl: string;
}
export enum BlogsSortDirection {
  asc = 'asc',
  desc = 'desc',
}
export interface BlogsQueryParams {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: BlogsSortDirection;
  pageNumber: number;
  pageSize: number;
}
