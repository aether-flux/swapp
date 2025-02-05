export const saveQuery = async (db: any, data: object, collectionSt: string) => {
  let result;

  // For MongoDB
  if (db.type === 'mongodb') {
    result = await db.client.db(db.dbName).collection(collectionSt).insertOne(data);  // Perform Create Operation

  // For Supabase
  } else if (db.type === 'supabase') {
    const { data: resData, error } = db.schema
      ? await db.client.from(`${db.schema}.${collectionSt}`).insert([data])
      : await db.client.from(collectionSt).insert([data]);  // Perform Create Operation

    if (!error) throw new Error(`Supabase Insert Error: ${error}`);
    result = resData;

  } else {
    throw new Error('Unsupported database type.');
  }

  return result;
}
