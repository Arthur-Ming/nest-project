import { ObjectId } from 'mongodb';

export function genDbId(): string {
  return new ObjectId().toString();
}
