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
exports.getQuery = void 0;
const parser_1 = require("../utils/parser");
const getQuery = (db, collection, query) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    let fq;
    // For MongoDB
    if (db.type === 'mongodb') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'mongodb') : null; // Get MongoDB style query
        result = fq ? yield db.client.db(db.dbName).collection(collection).find(fq.query).sort(fq.sort).toArray() : yield db.client.db(db.dbName).collection(collection).find().toArray(); // Perform Read Operation
        // For Supabase
    }
    else if (db.type === 'supabase') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'supabase') : null; // Get Supabase style query
        fq = fq;
        let supabaseQuery = db.client.from(collection).select("*"); // Base query for operation
        // Apply filters
        if (fq && fq.filters) {
            fq.filters.forEach((filter) => {
                supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
            });
        }
        // Apply orderBy if present
        if (fq.orderBy) {
            supabaseQuery = supabaseQuery.order(fq.orderBy.field, { ascending: fq.orderBy.direction === 'ASC' });
        }
        let { data, error } = yield supabaseQuery; // Perform the Read Operation
        result = data;
        if (error) {
            throw error;
        }
        else if (!data) {
            throw new Error("No data returned, but no error provided.");
        }
    }
    else {
        throw new Error('Unsupported database type.');
    }
    return result;
});
exports.getQuery = getQuery;
