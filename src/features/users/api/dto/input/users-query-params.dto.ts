import { SortDirections } from '../../../../../common/types/enum';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { DefaultQueryParams } from '../../../../../common/constans/default-query-params';
import { IsSortDirection } from '../../../../../common/decorators/validate/is-sort-direction';
import { ToNumber } from '../../../../../common/decorators/transform/to-number';

export class UsersQueryParamsDto {
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

  @IsOptional()
  @IsString()
  searchLoginTerm: string = DefaultQueryParams.searchLoginTerm;

  @IsOptional()
  @IsString()
  searchEmailTerm: string = DefaultQueryParams.searchEmailTerm;
}
