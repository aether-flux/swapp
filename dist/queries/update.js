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
exports.updateQuery = void 0;
const parser_1 = require("../utils/parser");
const updateQuery = (db, data, collection, query) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    let fq;
    if (db.type === 'mongodb') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'mongodb') : null;
        console.log('Parsed query: ', fq);
        result = yield db.client.db(db.dbName).collection(collection).updateMany(fq === null || fq === void 0 ? void 0 : fq.query, { $set: data });
    }
    else if (db.type === 'supabase') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'supabase') : null;
        console.log('Parsed query: ', fq);
        let supabaseQuery = db.client.from(collection).update(data);
        fq === null || fq === void 0 ? void 0 : fq.filters.forEach((filter) => {
            supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
        });
        const { data: resD, error } = yield supabaseQuery;
        result = resD;
        if (error) {
            console.error("Supabase Error:", JSON.stringify(error, null, 2));
            throw error;
        }
    }
    else {
        throw new Error("Unsupported database.");
    }
    return result;
});
exports.updateQuery = updateQuery;
