import mongoose from 'mongoose';
import { CartsManagerMongo } from '../cartsManagerMongo.js'; 
import { logger } from '../../../../helpers/logger.js';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    // full_name: {
    //     type: String,
    //     //required: true,
    // },
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    age: Number,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user'
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                reference: {
                    type: String,
                    required: true
                },
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'incomplete', 'complete'],
        default: 'pending'
    },
    avatar: {
        type: String,
        default: ""
    }
    
})

userSchema.pre('save', async function(next) {
    try {
        const cartsManager  = new CartsManagerMongo()
        const newCart = await cartsManager.createCart({})
        this.cart = newCart._id
    } catch (error) {
        logger.error('error al crear el carrito con el usuario',error)
        next(error)
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema);