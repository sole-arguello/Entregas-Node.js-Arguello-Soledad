import mongoose from 'mongoose';
import { config } from '../src/config/config.js'
import { productsModel } from '../src/dao/managers/mongo/models/products.model.js'

await mongoose.connect(config.mongo.url)

const updateProducts = async () => {
    try {
        const adminId = '6533fabfc5bc693b8dd0cc30'
        const result = await productsModel.updateMany({}, { $set: {owner: adminId} }) 
        console.log( result )
    } catch (error) {
        console.log(error.message)
    }
}
//node scripts/mongo.script.js
updateProducts()