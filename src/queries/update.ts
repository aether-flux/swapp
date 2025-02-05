import { abstractQuery } from "../utils/parser";

export const updateQuery = async (db: any, data: object, collection: string, query: string) => {
  let result;
  let fq;

  // For MongoDB
  if (db.type === 'mongodb') {
    fq = query ? abstractQuery(query, 'mongodb') as {query: any, sort: {[x: number]: number;} | null} : null;  // Get MongoDB style query

    result = await db.client.db(db.dbName).collection(collection).updateMany(fq?.query, {$set: data});  // Perform Update Operation

    // For Supabase
  } else if (db.type === 'supabase') {
    fq = query ? abstractQuery(query, 'supabase') as {filters: any, orderBy: any} : null;  // Get Supabase style query

    let supabaseQuery = db.client.from(collection).update(data);  // Base query for operation

    // Apply filters
    fq?.filters.forEach((filter: any) => {
      supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
    })

    const {data: resD, error} = await supabaseQuery;  // Perform the Create Operation
    result = resD;

    if (error) {
      throw error;
    } 

  } else {
    throw new Error("Unsupported database.");
  }

  return result;
}
