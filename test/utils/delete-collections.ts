import { Connection } from 'mongoose';
import { dbCollections } from '../../src/common/enum/db-collections';

export async function deleteCollections(
  databaseConnection: Connection,
  collections: string[] = Object.values(dbCollections)
) {
  const cPs = collections.map((collection) =>
    databaseConnection.collection(collection).deleteMany({})
  );
  await Promise.all(cPs);
}
