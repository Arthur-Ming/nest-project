import { SortDirections } from '../enum/sort-directions';

export const DefaultQueryParams = {
  searchNameTerm: '',
  sortBy: 'createdAt',
  sortDirection: SortDirections.desc,
  pageNumber: 1,
  pageSize: 10,
  searchLoginTerm: '',
  searchEmailTerm: '',
};
