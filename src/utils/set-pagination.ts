import { InputQueryParams, QueryParamsDTO, SortDirections } from '../common/types/interfaces';
import { UsersQueryParamsDto } from '../features/users/application/dto/users-query-params.dto';
import { UsersQueryParamsInputModel } from '../features/users/api/models/input/users-query-params.input.model';

export function setPagination(input: InputQueryParams): QueryParamsDTO {
  return {
    searchNameTerm: input?.searchNameTerm ? input.searchNameTerm : '',
    sortBy: input?.sortBy ? input.sortBy : 'createdAt',
    sortDirection: input?.sortDirection ? input.sortDirection : SortDirections.desc,
    pageNumber: input?.pageNumber ? Number(input.pageNumber) : 1,
    pageSize: input?.pageSize ? Number(input.pageSize) : 10,
  };
}

export function setPaginationForUsers(input: UsersQueryParamsInputModel): UsersQueryParamsDto {
  return {
    searchLoginTerm: input?.searchLoginTerm ? input.searchLoginTerm : '',
    searchEmailTerm: input?.searchEmailTerm ? input.searchEmailTerm : '',
    sortBy: input?.sortBy ? input.sortBy : 'createdAt',
    sortDirection: input?.sortDirection ? input.sortDirection : SortDirections.desc,
    pageNumber: input?.pageNumber ? Number(input.pageNumber) : 1,
    pageSize: input?.pageSize ? Number(input.pageSize) : 10,
  };
}
