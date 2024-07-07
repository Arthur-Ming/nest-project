import { SortDirections } from '../../../../common/types/interfaces';

export interface UsersQueryParamsDto {
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}
