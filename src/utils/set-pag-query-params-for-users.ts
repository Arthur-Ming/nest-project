import { UsersQueryParamsInputModel } from '../features/users/api/models/input/users-query-params.input.model';
import { UsersQueryParamsDto } from '../features/users/application/dto/users-query-params.dto';
import { DefaultQueryParams } from '../common/constans/default-query-params';

export function setPagQueryParamsForUsers(input: UsersQueryParamsInputModel): UsersQueryParamsDto {
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
