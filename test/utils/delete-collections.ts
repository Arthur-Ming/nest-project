import { Connection } from 'mongoose';
import { dbCollections } from '../../src/common/types/enum';

export const deleteCollections = async (
  databaseConnection: Connection,
  collections: string[] = Object.values(dbCollections)
) => {
  const cPs = collections.map((collection) =>
    databaseConnection.collection(collection).deleteMany({})
  );
  const deleteResult = await Promise.all(cPs);
  return deleteResult;
};
