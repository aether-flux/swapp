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
    // For MongoDB
    if (db.type === 'mongodb') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'mongodb') : null; // Get MongoDB style query
        result = yield db.client.db(db.dbName).collection(collection).updateMany(fq === null || fq === void 0 ? void 0 : fq.query, { $set: data }); // Perform Update Operation
        // For Supabase
    }
    else if (db.type === 'supabase') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'supabase') : null; // Get Supabase style query
        let supabaseQuery = db.client.from(collection).update(data); // Base query for operation
        // Apply filters
        fq === null || fq === void 0 ? void 0 : fq.filters.forEach((filter) => {
            supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
        });
        const { data: resD, error } = yield supabaseQuery; // Perform the Create Operation
        result = resD;
        if (error) {
            throw error;
        }
    }
    else {
        throw new Error("Unsupported database.");
    }
    return result;
});
exports.updateQuery = updateQuery;
