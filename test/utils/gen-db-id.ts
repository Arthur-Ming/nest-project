import { v4 as uuidv4 } from 'uuid';

export function genDbId(): string {
  return uuidv4().toString();
}
