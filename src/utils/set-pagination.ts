import { InputQueryParams, QueryParamsDTO, SortDirections } from '../common/types/interfaces';

export function setPagination(input: InputQueryParams): QueryParamsDTO {
  return {
    searchNameTerm: input?.searchNameTerm ?? '',
    sortBy: input?.sortBy ?? 'createdAt',
    sortDirection: input?.sortDirection ?? SortDirections.desc,
    pageNumber: input?.pageNumber ? Number(input.pageNumber) : 1,
    pageSize: input?.pageSize ? Number(input.pageSize) : 10,
  };
}
