import { IsValidDbId } from '../../../../../common/decorators/validate/is-valid-db-id';

export class DeviceById {
  @IsValidDbId()
  id: string;
}
