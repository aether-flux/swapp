import { SupabaseConfig } from "../interfaces/supabaseInterface";
import { deleteQuery } from "../queries/delete";
import { getQuery } from "../queries/get";
import { saveQuery } from "../queries/save";
import { updateQuery } from "../queries/update";

export class SupabaseDb {
  private client: any;
  private schema: string | undefined;
  private sbUrl: string;
  private sbKey: string;

  constructor (sbConf: SupabaseConfig) {
    if (!sbConf.supabaseKey || !sbConf.supabaseUrl) {
      throw new Error('Supabase URL and Key required.');
    }

    this.sbUrl = sbConf.supabaseUrl;
    this.sbKey = sbConf.supabaseKey;
    this.schema = sbConf.schema || undefined;
  }

  public async connect () {
    try {
      const {createClient} = require('@supabase/supabase-js');
      if (this.schema) {
        this.client = createClient(this.sbUrl, this.sbKey, {db: {schema: this.schema}});
      } else {
        this.client = createClient(this.sbUrl, this.sbKey);
      }
      console.log('Supabase DB connected.');
    } catch (e) {
      throw new Error("Supabase connection failed, or library is missing. Run: 'npm install @supabase/supabase-js'");
    }
  }

  public async save (data: object, table: string) {
    try {
      let result;
      if (this.schema) {
        result = await saveQuery({type: 'supabase', client: this.client, schema: this.schema}, data, table);
      } else {
        result = await saveQuery({type: 'supabase', client: this.client}, data, table);
      }
      return result;
    } catch (e) {
      console.error(`Error saving data: ${e}`);
    }
  }

  public async get (table: string, query?: string) {
    try {
      const result = await getQuery({type: 'supabase', client: this.client}, table, query);
      console.log(`Data fetched: ${result}`);
      return result;
    } catch (e) {
      console.error(`Error fetching data: ${JSON.stringify(e, null, 2)}`);
    }
  }

  public async update (table: string, query: string, data: object) {
    try {
      const result = await updateQuery({type: 'supabase', client: this.client}, data, table, query);
      console.log('Data updated: ', result);
      return result;
    } catch (e) {
      console.error(`Error updating data: ${JSON.stringify(e, null, 2)}`);
    }
  }

  public async delete (table: string, query: string) {
    try {
      const result = await deleteQuery({type: 'supabase', client: this.client}, table, query);
      console.log("Data deleted: ", result);
      return result;
    } catch (e) {
      console.error("Error deleting data: ", e);
    }
  }
}
