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
exports.deleteQuery = void 0;
const parser_1 = require("../utils/parser");
const deleteQuery = (db, collection, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let result;
    let fq;
    if (db.type === 'mongodb') {
        fq = query ? (0, parser_1.abstractQuery)(query, "mongodb") : null;
        if (!fq || !(fq === null || fq === void 0 ? void 0 : fq.query))
            throw new Error("Invalid or missing query for deletion.");
        result = yield db.client.db(db.dbName).collection(collection).deleteMany(fq.query);
    }
    else if (db.type === 'supabase') {
        fq = query ? (0, parser_1.abstractQuery)(query, 'supabase') : null;
        if (!((_a = fq === null || fq === void 0 ? void 0 : fq.filters) === null || _a === void 0 ? void 0 : _a.length))
            throw new Error("Invalid or missing query for deletion.");
        let supabaseQuery = db.client.from(collection).delete();
        fq.filters.forEach((filter) => {
            supabaseQuery = supabaseQuery.filter(filter.field, filter.operator, filter.value);
        });
        const { data, error } = yield supabaseQuery;
        if (error)
            throw error;
        result = data;
    }
    else {
        throw new Error("Unsupported database type.");
    }
    return result;
});
exports.deleteQuery = deleteQuery;
