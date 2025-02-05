import { abstractQuery } from "../utils/parser";

export const deleteQuery = async (db: any, collection: string, query: string) => {
  let result;
  let fq;

  // For MongoDB
  if (db.type === 'mongodb') {
    fq = query ? abstractQuery(query, "mongodb") as {query: any, sort: {[x: number]: number;} | null} : null;  // Get MongoDB style query

    if (!fq || !fq?.query) throw new Error("Invalid or missing query for deletion.");

    result = await db.client.db(db.dbName).collection(collection).deleteMany(fq.query);  // Perform Delete Operation

  // For Supabase
  } else if (db.type === 'supabase') {
    fq = query ? abstractQuery(query, 'supabase') as {filters: any[], orderBy: any} : null;  // Get Supabase style query

    if (!fq?.filters?.length) throw new Error("Invalid or missing query for deletion.");

    let supabaseQuery = db.client.from(collection).delete();  // Base query for operation

    // Apply filters
    fq.filters.forEach((filter: any) => {
        supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
    });

    const {data, error} = await supabaseQuery;  // Perform the Delete Operation

    if (error) throw error;
    result = data;

  } else {
    throw new Error("Unsupported database type.");
  }

  return result;
}
