import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
    try {
        const url = config.mongo.url
        await mongoose.connect(url);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.log('Hubo un error al conectarse a la base de datos', error.message);
    }
}