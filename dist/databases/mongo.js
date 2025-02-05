"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDb = void 0;
const delete_1 = require("../queries/delete");
const get_1 = require("../queries/get");
const save_1 = require("../queries/save");
const update_1 = require("../queries/update");
const path_1 = __importDefault(require("path"));
class MongoDb {
    // New MongoDB setup
    constructor(config) {
        try {
            const { MongoClient } = require(path_1.default.resolve(process.cwd(), 'node_modules/mongodb')); // Import mongodb from user's directory
            this.client = new MongoClient(config.connectionString); // Create a new client
            this.dbName = config.dbName;
        }
        catch (e) {
            throw new Error('MongoDB is missing. Run: npm install mongodb');
        }
    }
    // Connect the database
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
            }
            catch (e) {
                console.error(`Failed to connect to MongoDB: ${e}`);
            }
        });
    }
    // Crud Operation
    save(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, save_1.saveQuery)({ type: 'mongodb', client: this.client, dbName: this.dbName }, data, collection);
                return result;
            }
            catch (error) {
                console.error(`Error saving data: ${error}`);
            }
        });
    }
    // cRud Operation
    get(collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, get_1.getQuery)({ type: 'mongodb', client: this.client, dbName: this.dbName }, collection, query);
                return result;
            }
            catch (error) {
                console.error(`Error fetching data: ${error}`);
            }
        });
    }
    // crUd Operation
    update(collection, query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, update_1.updateQuery)({ type: 'mongodb', client: this.client, dbName: this.dbName }, data, collection, query);
                return result;
            }
            catch (e) {
                console.error(`Error updating data: ${JSON.stringify(e, null, 2)}`);
            }
        });
    }
    // cruD Operation
    delete(collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, delete_1.deleteQuery)({ type: 'mongodb', client: this.client, dbName: this.dbName }, collection, query);
                return result;
            }
            catch (e) {
                console.error('Error deleting data: ', e);
            }
        });
    }
}
exports.MongoDb = MongoDb;
