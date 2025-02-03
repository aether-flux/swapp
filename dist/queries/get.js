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
    if (db.type === 'mongodb') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'mongodb') : null;
        console.log(`Parsed query: ${fq}`);
        result = fq ? yield db.client.db(db.dbName).collection(collection).find(fq.query).toArray() : yield db.client.db(db.dbName).collection(collection).find().toArray();
    }
    else if (db.type === 'supabase') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'supabase') : null;
        fq = fq;
        console.log(`Parsed query: ${JSON.stringify(fq, null, 2)}`);
        let supabaseQuery = db.client.from(collection).select("*");
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
        let { data, error } = yield supabaseQuery;
        result = data;
        if (error) {
            console.error("Supabase Error:", JSON.stringify(error, null, 2));
            throw error;
        }
        else if (!data) {
            console.error("Supabase returned no data and no error. Possible issue with the query.");
            throw new Error("No data returned, but no error provided.");
        }
    }
    else {
        throw new Error('Unsupported database type.');
    }
    return result;
});
exports.getQuery = getQuery;
