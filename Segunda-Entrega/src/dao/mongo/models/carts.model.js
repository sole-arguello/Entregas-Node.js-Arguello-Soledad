import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                _id: String,
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []//para cuando se cree los productos se cree el carrito vacio
    }
})

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);