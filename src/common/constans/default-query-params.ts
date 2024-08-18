import { SortDirections } from '../types/enum';

export const DefaultQueryParams = {
  searchNameTerm: '',
  sortBy: 'createdAt',
  sortDirection: SortDirections.desc,
  pageNumber: 1,
  pageSize: 10,
  searchLoginTerm: '',
  searchEmailTerm: '',
};
