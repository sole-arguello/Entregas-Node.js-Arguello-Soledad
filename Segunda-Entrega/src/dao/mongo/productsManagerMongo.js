import { productsModel } from './models/products.model.js';

export class ProductsManagerMongo{

    constructor(){
        this.model = productsModel
    }

    async createProduct(infoProduct){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.create(infoProduct);
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('crear producto',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo crea el producto',error.message);
        }
    }
    async getProducts(){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.find().lean();//soluciona el bloqueo de handelbarspara mostrar en home
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('obtener producto',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo obtener el listado de  producto',error.message);
        }
    }
    async getProductById(id){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.findById(id);//tambien se puede usar findOne({_id: id})
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('obtener un producto',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo obtener el producto',error.message);
        }
    }
    async updateProduct(id, product){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.findOneAndUpdate({_id: id}, product, {new: true});//tambien se puede usar updateOne({_id: id}, product)
            if(!resultado){
                throw new Error('No se pudo encontrar el producto, para actualizarlo');
            }
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('actualizar producto',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo actualizar el producto',error.message);
        }
    }
    async deleteProduct(id){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.findByIdAndDelete(id);//tambien se puede usar deleteOne({_id: id})
            if(!resultado){
                throw new Error('No se pudo encontrar el producto a eliminar');
            }
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('eliminar producto',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo encontrar el producto, para actualizarlo',error.message);
        }
    }
}