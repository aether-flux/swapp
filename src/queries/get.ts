import { abstractQuery } from "../utils/parser";

export const getQuery = async (db: any, collection: string, query?: string) => {
  let result;
  let fq;

  if (db.type === 'mongodb') {
    fq = query ? abstractQuery(query, 'mongodb') : null;
    console.log(`Parsed query: ${fq}`);
    result = fq ? await db.client.db(db.dbName).collection(collection).find((fq as {query: any, sort: {[x: number]: number;}|null}).query).toArray() : await db.client.db(db.dbName).collection(collection).find().toArray();
  } else if (db.type === 'supabase') {
    fq = query ? abstractQuery(query, 'supabase') : null;
    fq = fq as {filters: any, orderBy: any};
    console.log(`Parsed query: ${JSON.stringify(fq, null, 2)}`);

    let supabaseQuery = db.client.from(collection).select("*");

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

    let {data, error} = await supabaseQuery;
    result = data;

    if (error) {
      console.error("Supabase Error:", JSON.stringify(error, null, 2));
      throw error;
    } else if (!data) {
      console.error("Supabase returned no data and no error. Possible issue with the query.");
      throw new Error("No data returned, but no error provided.");
    }
  } else {
    throw new Error('Unsupported database type.');
  }

  return result;
}
