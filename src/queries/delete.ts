import { abstractQuery } from "../utils/parser";

export const deleteQuery = async (db: any, collection: string, query: string) => {
  let result;
  let fq;

  if (db.type === 'mongodb') {
    fq = query ? abstractQuery(query, "mongodb") as {query: any, sort: {[x: number]: number;} | null} : null;

    if (!fq || !fq?.query) throw new Error("Invalid or missing query for deletion.");

    result = await db.client.db(db.dbName).collection(collection).deleteMany(fq.query);

  } else if (db.type === 'supabase') {
    fq = query ? abstractQuery(query, 'supabase') as {filters: any[], orderBy: any} : null;

    if (!fq?.filters?.length) throw new Error("Invalid or missing query for deletion.");

    let supabaseQuery = db.client.from(collection).delete();

    fq.filters.forEach((filter: any) => {
        supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
    });

    const {data, error} = await supabaseQuery;

    if (error) throw error;
    result = data;

  } else {
    throw new Error("Unsupported database type.");
  }

  return result;
}
