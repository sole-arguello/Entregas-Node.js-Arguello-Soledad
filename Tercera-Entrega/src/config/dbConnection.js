import mongoose from "mongoose";
import { config } from "./config.js";


export class connectDB {
    static #instance;
    
    static #getConnection() {
        const URL = config.mongo.url
        const connection = mongoose.connect(URL);
        console.log('Conectado a la base de datos');
        return connection;
    }

    static getInstance() {
        if (this.#instance) {
            console.log('La conexion a la base de datos ya existe');
            return this.#instance;
        }else{
            this.#instance = this.#getConnection();
            return this.#instance
        }
    }
}
