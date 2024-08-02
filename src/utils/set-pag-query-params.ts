import { InputQueryParams, QueryParamsDTO } from '../common/types/interfaces';
import { DefaultQueryParams } from '../common/constans/default-query-params';

export function setPagQueryParams(input: InputQueryParams): QueryParamsDTO {
  return {
    searchNameTerm: input?.searchNameTerm
      ? input.searchNameTerm
      : DefaultQueryParams.searchNameTerm,
    sortBy: input?.sortBy ? input.sortBy : DefaultQueryParams.sortBy,
    sortDirection: input?.sortDirection ? input.sortDirection : DefaultQueryParams.sortDirection,
    pageNumber: input?.pageNumber ? Number(input.pageNumber) : DefaultQueryParams.pageNumber,
    pageSize: input?.pageSize ? Number(input.pageSize) : DefaultQueryParams.pageSize,
  };
}
