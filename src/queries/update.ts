import { abstractQuery } from "../utils/parser";

export const updateQuery = async (db: any, data: object, collection: string, query: string) => {
  let result;
  let fq;

  if (db.type === 'mongodb') {
    fq = query ? abstractQuery(query, 'mongodb') as {query: any, sort: {[x: number]: number;} | null} : null;
    console.log('Parsed query: ', fq);

    result = await db.client.db(db.dbName).collection(collection).updateMany(fq?.query, {$set: data});
  } else if (db.type === 'supabase') {
    fq = query ? abstractQuery(query, 'supabase') as {filters: any, orderBy: any} : null;
    console.log('Parsed query: ', fq);

    let supabaseQuery = db.client.from(collection).update(data);

    fq?.filters.forEach((filter: any) => {
      supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
    })

    const {data: resD, error} = await supabaseQuery;
    result = resD;

    if (error) {
      console.error("Supabase Error:", JSON.stringify(error, null, 2));
      throw error;
    } 

  } else {
    throw new Error("Unsupported database.");
  }

  return result;
}
