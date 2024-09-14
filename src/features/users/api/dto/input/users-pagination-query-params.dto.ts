import { IsOptional, IsString } from 'class-validator';
import { DefaultQueryParams } from '../../../../../common/constans/default-query-params';
import { BasePaginationQueryParamsDto } from '../../../../../common/dto/query-params.dto';

export class UsersPaginationQueryParamsDto extends BasePaginationQueryParamsDto {
  @IsOptional()
  @IsString()
  searchLoginTerm: string = DefaultQueryParams.searchLoginTerm;

  @IsOptional()
  @IsString()
  searchEmailTerm: string = DefaultQueryParams.searchEmailTerm;
}
