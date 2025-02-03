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
exports.SupabaseDb = void 0;
const delete_1 = require("../queries/delete");
const get_1 = require("../queries/get");
const save_1 = require("../queries/save");
const update_1 = require("../queries/update");
class SupabaseDb {
    constructor(sbConf) {
        if (!sbConf.supabaseKey || !sbConf.supabaseUrl) {
            throw new Error('Supabase URL and Key required.');
        }
        this.sbUrl = sbConf.supabaseUrl;
        this.sbKey = sbConf.supabaseKey;
        this.schema = sbConf.schema || undefined;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { createClient } = require('@supabase/supabase-js');
                if (this.schema) {
                    this.client = createClient(this.sbUrl, this.sbKey, { db: { schema: this.schema } });
                }
                else {
                    this.client = createClient(this.sbUrl, this.sbKey);
                }
                console.log('Supabase DB connected.');
            }
            catch (e) {
                throw new Error("Supabase connection failed, or library is missing. Run: 'npm install @supabase/supabase-js'");
            }
        });
    }
    save(data, table) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                if (this.schema) {
                    result = yield (0, save_1.saveQuery)({ type: 'supabase', client: this.client, schema: this.schema }, data, table);
                }
                else {
                    result = yield (0, save_1.saveQuery)({ type: 'supabase', client: this.client }, data, table);
                }
                return result;
            }
            catch (e) {
                console.error(`Error saving data: ${e}`);
            }
        });
    }
    get(table, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, get_1.getQuery)({ type: 'supabase', client: this.client }, table, query);
                console.log(`Data fetched: ${result}`);
                return result;
            }
            catch (e) {
                console.error(`Error fetching data: ${JSON.stringify(e, null, 2)}`);
            }
        });
    }
    update(table, query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, update_1.updateQuery)({ type: 'supabase', client: this.client }, data, table, query);
                console.log('Data updated: ', result);
                return result;
            }
            catch (e) {
                console.error(`Error updating data: ${JSON.stringify(e, null, 2)}`);
            }
        });
    }
    delete(table, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, delete_1.deleteQuery)({ type: 'supabase', client: this.client }, table, query);
                console.log("Data deleted: ", result);
                return result;
            }
            catch (e) {
                console.error("Error deleting data: ", e);
            }
        });
    }
}
exports.SupabaseDb = SupabaseDb;
