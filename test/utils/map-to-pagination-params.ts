import { QueryParamsDTO } from '../../src/common/types/interfaces';

export function mapToPaginationParams(queryParams: QueryParamsDTO, entitiesCount: number) {
  return {
    pagesCount: Math.ceil(entitiesCount / queryParams.pageSize),
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    totalCount: entitiesCount,
  };
}
