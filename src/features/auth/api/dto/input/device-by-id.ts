import { IsUUID } from 'class-validator';

export class DeviceById {
  @IsUUID()
  id: string;
}
