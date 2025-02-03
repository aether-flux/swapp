import { MongoDbConfig } from "./interfaces/mongoInterface";
import { SupabaseConfig } from "./interfaces/supabaseInterface";

export class Swapp {
  private dbType: string;
  private dbConfig: Record<string, any>;
  private dbClient: any;

  constructor (options: {dbType: string, config: Record<string, any>}) {
    this.dbType = options.dbType;
    this.dbConfig = options.config;

    if (this.dbType === 'mongodb') {
      const {MongoDb} = require('./databases/mongo');
      this.dbClient = new MongoDb(this.dbConfig as MongoDbConfig);
    } else if (this.dbType === 'supabase') {
      const {SupabaseDb} = require('./databases/supabase');
      this.dbClient = new SupabaseDb(this.dbConfig as SupabaseConfig);
    } else {
      throw new Error('Unsupported database type.');
    }

    // Initialize the required database
    // this.initializeDB();
  }

  private async initializeDb () {
    if (!this.dbClient) {
      throw new Error("Database client does not exist.");
    }
    await this.dbClient.connect();
  }

  public async save (collection: string, data: object) {
    if (!this.dbClient) {
      throw new Error("Database client is not initialized. Use 'await (new Swapp({...}).initializeDb())'");
    }

    let saveData = await this.dbClient.save(collection, data);
    return saveData;
  }

  public async get (collection: string, query?: string) {
    if (!this.dbClient) {
      throw new Error("Database client is not initialized. Use 'await (new Swapp({...}).initializeDb())'");
    }

    let getData = await this.dbClient.get(collection, query);
    return getData;
  }

  public async update (collection: string, query: string, data: object) {
    if (!this.dbClient) {
      throw new Error("Database client is not initialized. Use 'await (new Swapp({...}).initializeDb())");
    }

    let updateData = await this.dbClient.update(collection, query, data);
    return updateData;
  }

  public async delete (collection: string, query: string) {
    if (!this.dbClient) {
      throw new Error("Database client is not initialized. Use 'await (new Swapp({...}).initializeDb())'");
    }

    let deleteData = await this.dbClient.delete(collection, query);
    return deleteData;
  }
}
