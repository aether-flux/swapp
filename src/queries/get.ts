import { abstractQuery } from "../utils/parser";

export const getQuery = async (db: any, collection: string, query?: string) => {
  let result;
  let fq;

  // For MongoDB
  if (db.type === 'mongodb') {
    fq = query ? abstractQuery(query, 'mongodb') : null;  // Get MongoDB style query

    result = fq ? await db.client.db(db.dbName).collection(collection).find((fq as {query: any, sort: {[x: number]: number;}|null}).query).sort((fq as {query: any, sort: {[x: number]: number;}|null}).sort).toArray() : await db.client.db(db.dbName).collection(collection).find().toArray();  // Perform Read Operation

  // For Supabase
  } else if (db.type === 'supabase') {
    fq = query ? abstractQuery(query, 'supabase') : null;  // Get Supabase style query
    fq = fq as {filters: any, orderBy: any};

    let supabaseQuery = db.client.from(collection).select("*");  // Base query for operation

    // Apply filters
    if (fq && fq.filters) {
      fq.filters.forEach((filter: any) => {
        supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
      });
    }

    // Apply orderBy if present
    if (fq.orderBy) {
      supabaseQuery = supabaseQuery.order(fq.orderBy.field, { ascending: fq.orderBy.direction === 'ASC' });
    }

    let {data, error} = await supabaseQuery;  // Perform the Read Operation
    result = data;

    if (error) {
      throw error;
    } else if (!data) {
      throw new Error("No data returned, but no error provided.");
    }
  } else {
    throw new Error('Unsupported database type.');
  }

  return result;
}
