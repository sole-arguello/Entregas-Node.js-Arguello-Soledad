import mongoose from "mongoose";


const tiketsCollection = 'tikets';

const tiketSchema = new mongoose.Schema({
    
    code:{
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime:{
        type: Date,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    purchaser:{
        type: String,
        required: true
    }
    
})

export const tiketModel = mongoose.model(tiketsCollection, tiketSchema);