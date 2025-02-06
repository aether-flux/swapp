"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
                // const {createClient} = require(path.resolve(process.cwd(), 'node_modules/@supabase/supabase-js'));  // Import supabase from user's directory
                const { createClient } = yield Promise.resolve().then(() => __importStar(require("@supabase/supabase-js")));
                //
                // const require = createRequire(import.meta.url); // Force require() in CommonJS
                // const { createClient } = require("@supabase/supabase-js"); // Load Supabase
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
    save(table, data) {
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
