import { SortDirections } from '../../../../common/enum/sort-directions';

export interface UsersQueryParamsDto {
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}
