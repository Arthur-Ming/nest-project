import { SortDirections } from '../../../../common/types/enum';

export interface UsersQueryParamsDto {
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}
