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
exports.saveQuery = void 0;
const saveQuery = (db, data, collectionSt) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    // For MongoDB
    if (db.type === 'mongodb') {
        result = yield db.client.db(db.dbName).collection(collectionSt).insertOne(data); // Perform Create Operation
        // For Supabase
    }
    else if (db.type === 'supabase') {
        const { data: resData, error } = db.schema
            ? yield db.client.from(`${db.schema}.${collectionSt}`).insert([data])
            : yield db.client.from(collectionSt).insert([data]); // Perform Create Operation
        // if (error) throw new Error(`Supabase Insert Error: ${JSON.stringify(error, null, 2)}`);
        //
        if (error && Object.keys(error).length > 0) {
            throw new Error(`Supabase Insert Error: ${JSON.stringify(error, null, 2)}`);
        }
        result = resData;
    }
    else {
        throw new Error('Unsupported database type.');
    }
    return result;
});
exports.saveQuery = saveQuery;
