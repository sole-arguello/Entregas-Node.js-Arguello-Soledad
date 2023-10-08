import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    // products: {
    //     type: [
    //         {
    //             _id: String,
    //             quantity: {
    //                 type: Number,
    //                 required: true
    //             }
    //         }
    //     ],
    //     default: []//para cuando se cree los productos se cree el carrito vacio
    // }

    products: {//la variable que tiene la populacion
        type: [//tipo array
            {//id del producto igual que la DB
                _id: {//populacion
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",//donde esta almacenado los productos
                },
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