import { SortDirections } from '../../../../../common/types/interfaces';

export interface UsersQueryParamsInputModel {
  sortBy?: string;
  sortDirection?: SortDirections;
  pageNumber?: string;
  pageSize?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}
