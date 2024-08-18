import { UsersQueryParamsDto } from '../features/users/api/dto/input/users-query-params.dto';
import { DefaultQueryParams } from '../common/constans/default-query-params';

export function setPagQueryParamsForUsers(input: UsersQueryParamsDto): UsersQueryParamsDto {
  return {
    searchLoginTerm: input?.searchLoginTerm
      ? input.searchLoginTerm
      : DefaultQueryParams.searchLoginTerm,
    searchEmailTerm: input?.searchEmailTerm
      ? input.searchEmailTerm
      : DefaultQueryParams.searchEmailTerm,
    sortBy: input?.sortBy ? input.sortBy : DefaultQueryParams.sortBy,
    sortDirection: input?.sortDirection ? input.sortDirection : DefaultQueryParams.sortDirection,
    pageNumber: input?.pageNumber ? Number(input.pageNumber) : DefaultQueryParams.pageNumber,
    pageSize: input?.pageSize ? Number(input.pageSize) : DefaultQueryParams.pageSize,
  };
}
