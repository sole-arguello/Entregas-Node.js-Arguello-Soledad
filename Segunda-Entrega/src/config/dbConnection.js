import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const url = 'mongodb+srv://soledadar:g04D4zMd9O4y2GvK@cluster0.njbseut.mongodb.net/ecommerceDB?retryWrites=true&w=majority'
        await mongoose.connect(url);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.log('Hubo un error al conectarse a la base de datos', error.message);
    }
}