import { BasePaginationQueryParamsDto } from '../../../../../common/dto/query-params.dto';
import { IsOptional, IsString } from 'class-validator';
import { DefaultQueryParams } from '../../../../../common/constans/default-query-params';

export class PostsPaginationQueryParamsDto extends BasePaginationQueryParamsDto {
  @IsOptional()
  @IsString()
  searchNameTerm: string = DefaultQueryParams.searchNameTerm;
}
