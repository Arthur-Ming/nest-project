import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { DefaultQueryParams } from '../constans/default-query-params';
import { IsSortDirection } from '../decorators/validate/is-sort-direction';
import { ToNumber } from '../decorators/transform/to-number';
import { SortDirections } from '../enum/sort-directions';

export class BasePaginationQueryParamsDto {
  @IsOptional()
  @IsString()
  sortBy: string = DefaultQueryParams.sortBy;

  @IsOptional()
  @IsSortDirection()
  @IsString()
  sortDirection: SortDirections = DefaultQueryParams.sortDirection;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @ToNumber()
  pageNumber: number = DefaultQueryParams.pageNumber;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @ToNumber()
  pageSize: number = DefaultQueryParams.pageSize;
}
