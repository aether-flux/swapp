import { createRequire } from "module";
import { SupabaseConfig } from "../interfaces/supabaseInterface";
import { deleteQuery } from "../queries/delete";
import { getQuery } from "../queries/get";
import { saveQuery } from "../queries/save";
import { updateQuery } from "../queries/update";
import path from 'path';

export class SupabaseDb {
  private client: any;
  private schema: string | undefined;
  private sbUrl: string;
  private sbKey: string;

  // New Supabase setup
  constructor (sbConf: SupabaseConfig) {
    if (!sbConf.supabaseKey || !sbConf.supabaseUrl) {
      throw new Error('Supabase URL and Key required.');
    }

    this.sbUrl = sbConf.supabaseUrl;
    this.sbKey = sbConf.supabaseKey;
    this.schema = sbConf.schema || undefined;
  }

  // Connect the database
  public async connect () {
    try {
      // const {createClient} = require(path.resolve(process.cwd(), 'node_modules/@supabase/supabase-js'));  // Import supabase from user's directory
      const { createClient } = await import("@supabase/supabase-js");
      //
      // const require = createRequire(import.meta.url); // Force require() in CommonJS
      // const { createClient } = require("@supabase/supabase-js"); // Load Supabase

      // Create the Supabase client
      if (this.schema) {
        this.client = createClient(this.sbUrl, this.sbKey, {db: {schema: this.schema}});
      } else {
        this.client = createClient(this.sbUrl, this.sbKey);
      }
    } catch (e) {
      throw new Error("Supabase connection failed, or library is missing. Run: 'npm install @supabase/supabase-js'");
    }
  }

  // Crud Operation
  public async save (table: string, data: object) {
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

  // cRud Operation
  public async get (table: string, query?: string) {
    try {
      const result = await getQuery({type: 'supabase', client: this.client}, table, query);
      return result;
    } catch (e) {
      console.error(`Error fetching data: ${JSON.stringify(e, null, 2)}`);
    }
  }

  // crUd Operation
  public async update (table: string, query: string, data: object) {
    try {
      const result = await updateQuery({type: 'supabase', client: this.client}, data, table, query);
      return result;
    } catch (e) {
      console.error(`Error updating data: ${JSON.stringify(e, null, 2)}`);
    }
  }

  // cruD Operation
  public async delete (table: string, query: string) {
    try {
      const result = await deleteQuery({type: 'supabase', client: this.client}, table, query);
      return result;
    } catch (e) {
      console.error("Error deleting data: ", e);
    }
  }
}
