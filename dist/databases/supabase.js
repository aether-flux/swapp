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
exports.SupabaseDb = void 0;
const delete_1 = require("../queries/delete");
const get_1 = require("../queries/get");
const save_1 = require("../queries/save");
const update_1 = require("../queries/update");
const path_1 = __importDefault(require("path"));
class SupabaseDb {
    // New Supabase setup
    constructor(sbConf) {
        if (!sbConf.supabaseKey || !sbConf.supabaseUrl) {
            throw new Error('Supabase URL and Key required.');
        }
        this.sbUrl = sbConf.supabaseUrl;
        this.sbKey = sbConf.supabaseKey;
        this.schema = sbConf.schema || undefined;
    }
    // Connect the database
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { createClient } = require(path_1.default.resolve(process.cwd(), '@supabase/supabase-js')); // Import supabase from user's directory
                // Create the Supabase client
                if (this.schema) {
                    this.client = createClient(this.sbUrl, this.sbKey, { db: { schema: this.schema } });
                }
                else {
                    this.client = createClient(this.sbUrl, this.sbKey);
                }
            }
            catch (e) {
                throw new Error("Supabase connection failed, or library is missing. Run: 'npm install @supabase/supabase-js'");
            }
        });
    }
    // Crud Operation
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
    // cRud Operation
    get(table, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, get_1.getQuery)({ type: 'supabase', client: this.client }, table, query);
                return result;
            }
            catch (e) {
                console.error(`Error fetching data: ${JSON.stringify(e, null, 2)}`);
            }
        });
    }
    // crUd Operation
    update(table, query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, update_1.updateQuery)({ type: 'supabase', client: this.client }, data, table, query);
                return result;
            }
            catch (e) {
                console.error(`Error updating data: ${JSON.stringify(e, null, 2)}`);
            }
        });
    }
    // cruD Operation
    delete(table, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, delete_1.deleteQuery)({ type: 'supabase', client: this.client }, table, query);
                return result;
            }
            catch (e) {
                console.error("Error deleting data: ", e);
            }
        });
    }
}
exports.SupabaseDb = SupabaseDb;
