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
const saveQuery = (db, data, collection) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (db.type === 'mongodb') {
        result = yield db.client.db(db.dbName).collection(collection).insertOne(data);
    }
    else if (db.type === 'supabase') {
        const { data: resData, error } = db.schema
            ? yield db.client.from(`${db.schema}.${collection}`).insert([data])
            : yield db.client.from(collection).insert([data]);
        if (!error)
            throw new Error(`Supabase Insert Error: ${error}`);
        result = resData;
    }
    else {
        throw new Error('Unsupported database type.');
    }
    return result;
});
exports.saveQuery = saveQuery;
