import { QueryParamsDto } from '../../src/common/dto/query-params.dto';

export function mapToPaginationParams(queryParams: QueryParamsDto, entitiesCount: number) {
  return {
    pagesCount: Math.ceil(entitiesCount / queryParams.pageSize),
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    totalCount: entitiesCount,
  };
}
