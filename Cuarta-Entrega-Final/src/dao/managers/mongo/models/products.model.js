import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    thumbnail: {
        type: [],
    },

    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['conjunto', 'bombis', 'body']
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }

})
productSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(productsCollection, productSchema);