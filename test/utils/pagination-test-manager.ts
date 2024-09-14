import { BasePaginationQueryParamsDto } from '../../src/common/dto/query-params.dto';

export class PaginationTestManager {
  expectPaginationParams<T extends BasePaginationQueryParamsDto>(
    responseModel: any,
    queryParams: T,
    totalCount: number
  ) {
    expect(responseModel).toMatchObject({
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: expect.any(Array),
    });

    const skip = (queryParams.pageNumber - 1) * queryParams.pageSize;

    const expectedItemsLength = Array(totalCount).slice(
      skip,
      queryParams.pageSize * queryParams.pageNumber
    ).length;
    expect(responseModel.items).toHaveLength(expectedItemsLength);
  }
}
