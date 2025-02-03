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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swapp = void 0;
class Swapp {
    constructor(options) {
        this.dbType = options.dbType;
        this.dbConfig = options.config;
        if (this.dbType === 'mongodb') {
            const { MongoDb } = require('./databases/mongo');
            this.dbClient = new MongoDb(this.dbConfig);
        }
        else if (this.dbType === 'supabase') {
            const { SupabaseDb } = require('./databases/supabase');
            this.dbClient = new SupabaseDb(this.dbConfig);
        }
        else {
            throw new Error('Unsupported database type.');
        }
        // Initialize the required database
        // this.initializeDB();
    }
    initializeDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbClient) {
                throw new Error("Database client does not exist.");
            }
            yield this.dbClient.connect();
        });
    }
    save(data, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbClient) {
                throw new Error("Database client is not initialized. Use 'await (new Swapp({...}).initializeDb())'");
            }
            let saveData = yield this.dbClient.save(data, collection);
            return saveData;
        });
    }
    get(collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbClient) {
                throw new Error("Database client is not initialized. Use 'await (new Swapp({...}).initializeDb())'");
            }
            let getData = yield this.dbClient.get(collection, query);
            return getData;
        });
    }
    update(collection, query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbClient) {
                throw new Error("Database client is not initialized. Use 'await (new Swapp({...}).initializeDb())");
            }
            let updateData = yield this.dbClient.update(collection, query, data);
            return updateData;
        });
    }
    delete(collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbClient) {
                throw new Error("Database client is not initialized. Use 'await (new Swapp({...}).initializeDb())'");
            }
            let deleteData = yield this.dbClient.delete(collection, query);
            return deleteData;
        });
    }
}
exports.Swapp = Swapp;
