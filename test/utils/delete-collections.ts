import { Connection } from 'mongoose';
import { dbCollections } from '../../src/common/types/enum';

export async function deleteCollections(
  databaseConnection: Connection,
  collections: string[] = ['blogs', 'posts', 'users']
) {
  const cPs = collections.map((collection) =>
    databaseConnection.collection(collection).deleteMany({})
  );
  await Promise.all(cPs);
  // console.log(r);

  // await databaseConnection.dropCollection('blogs');
  // await databaseConnection.dropCollection('posts');
  // await databaseConnection.collection('blogs').deleteMany({});
  // await databaseConnection.collection('posts').deleteMany({});

  console.log('delete db');
}
