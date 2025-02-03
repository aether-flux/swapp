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
exports.FirebaseDb = void 0;
const save_1 = require("../queries/save");
class FirebaseDb {
    constructor(config) {
        if (!config.apiKey || !config.projectId || !config.authDomain)
            throw new Error("Firebase API Key, Project ID and Auth Domain are required.");
        this.config = config;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { initializeApp } = require('firebase/app');
                const { getFirestore } = require('firebase/firestore');
                const firebaseApp = initializeApp(this.config);
                this.client = getFirestore(firebaseApp);
                console.log("Firestore DB connected.");
            }
            catch (e) {
                throw new Error("Firebase connection failed, or Firebase SDK is missing. Run: 'npm install firebase'");
            }
        });
    }
    save(data, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, save_1.saveQuery)({ type: 'firebase', client: this.client }, data, collection);
                return result;
            }
            catch (e) {
                console.error("Error saving data: ", e);
            }
        });
    }
}
exports.FirebaseDb = FirebaseDb;
