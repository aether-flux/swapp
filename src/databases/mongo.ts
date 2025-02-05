import type { MongoDbConfig } from "../interfaces/mongoInterface";
import { deleteQuery } from "../queries/delete";
import { getQuery } from "../queries/get";
import { saveQuery } from "../queries/save";
import { updateQuery } from "../queries/update";
import path from 'path';

export class MongoDb {
  private client: any;
  private dbName: string;

  // New MongoDB setup
  constructor (config: MongoDbConfig) {
    try {
      const {MongoClient} = require(path.resolve(process.cwd(), 'node_modules/mongodb'));  // Import mongodb from user's directory
      this.client = new MongoClient(config.connectionString);  // Create a new client
      this.dbName = config.dbName;
    } catch (e) {
      throw new Error('MongoDB is missing. Run: npm install mongodb');
    }
  }

  // Connect the database
  public async connect () {
    try {
      await this.client.connect();
    } catch (e) {
      console.error(`Failed to connect to MongoDB: ${e}`);
    }
  }

  // Crud Operation
  public async save (collection: string, data: object) {
    try {
      const result = await saveQuery({type: 'mongodb', client: this.client, dbName: this.dbName}, data, collection);
      return result;
    } catch (error) {
      console.error(`Error saving data: ${error}`);
    }
  }

  // cRud Operation
  public async get (collection: string, query?: string) {
    try {
      const result = await getQuery({type: 'mongodb', client: this.client, dbName: this.dbName}, collection, query);
      return result;
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    }
  }

  // crUd Operation
  public async update (collection: string, query: string, data: object) {
    try {
      const result = await updateQuery({type: 'mongodb', client: this.client, dbName: this.dbName}, data, collection, query);
      return result;
    } catch (e) {
      console.error(`Error updating data: ${JSON.stringify(e, null, 2)}`);
    }
  }

  // cruD Operation
  public async delete (collection: string, query: string) {
    try {
      const result = await deleteQuery({type: 'mongodb', client: this.client, dbName: this.dbName}, collection, query);
      return result;
    } catch (e) {
      console.error('Error deleting data: ', e);
    }
  }
}
