import { MongoDbConfig } from "../interfaces/mongoInterface";
import { deleteQuery } from "../queries/delete";
import { getQuery } from "../queries/get";
import { saveQuery } from "../queries/save";
import { updateQuery } from "../queries/update";

export class MongoDb {
  private client: any;
  private dbName: string;

  constructor (config: MongoDbConfig) {
    try {
      const {MongoClient} = require('mongodb');
      this.client = new MongoClient(config.connectionString);
      this.dbName = config.dbName;
    } catch (e) {
      throw new Error('MongoDB is missing. Run: npm install mongodb');
    }
  }

  public async connect () {
    try {
      await this.client.connect();
      console.log(`MongoDB connected. DB: ${this.dbName}`);
    } catch (e) {
      console.error(`Failed to connect to MongoDB: ${e}`);
    }
  }

  public async save (collection: string, data: object) {
    try {
      const result = await saveQuery({type: 'mongodb', client: this.client, dbName: this.dbName}, data, collection);
      console.log(`Data saved: ${result}`);
      return result;
    } catch (error) {
      console.error(`Error saving data: ${error}`);
    }
  }

  public async get (collection: string, query?: string) {
    try {
      const result = await getQuery({type: 'mongodb', client: this.client, dbName: this.dbName}, collection, query);
      console.log(`Data fetched: ${result}`);
      return result;
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    }
  }

  public async update (collection: string, query: string, data: object) {
    try {
      const result = await updateQuery({type: 'mongodb', client: this.client, dbName: this.dbName}, data, collection, query);
      console.log('Data updated: ', result);
      return result;
    } catch (e) {
      console.error(`Error updating data: ${JSON.stringify(e, null, 2)}`);
    }
  }

  public async delete (collection: string, query: string) {
    try {
      const result = await deleteQuery({type: 'mongodb', client: this.client, dbName: this.dbName}, collection, query);
      console.log("Data deleted: ", result);
      return result;
    } catch (e) {
      console.error('Error deleting data: ', e);
    }
  }
}
