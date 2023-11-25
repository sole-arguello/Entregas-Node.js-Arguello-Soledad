import mongoose from 'mongoose';
import { cartsDao } from '../../../index.js';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
      },
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
        enum: ['admin', 'user'],
        default: 'user'
    }
    
})

userSchema.pre('save', async function(next) {
    try {
        const newCart = await cartsDao.createCart({});
        this.cart = newCart._id
    } catch (error) {
        next(error)
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema);