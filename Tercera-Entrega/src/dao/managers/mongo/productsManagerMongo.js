import { productsModel } from './models/products.model.js';

export class ProductsManagerMongo{

    constructor(){
        this.model = productsModel
    }

    //metodo para obtener productos del paginate
    async getProductsPaginate(query, options){
        try {
            const result = await this.model.paginate(query, options);
            return result
        } catch (error) {
            console.log('obtener producto',error.message);
            throw new Error('No se pudo obtener el listado de  producto',error.message);
        }
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
    async getProductById(prodcutId){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.findById(prodcutId);//tambien se puede usar findOne({_id: id})
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('obtener un producto',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo obtener el producto',error.message);
        }
    }
    async updateProduct(prodcutId, newProduct){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.findOneAndUpdate({_id: prodcutId}, newProduct, {new: true});//tambien se puede usar updateOne({_id: id}, product)
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
    async deleteProduct(prodcutId){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.findByIdAndDelete(prodcutId);//tambien se puede usar deleteOne({_id: id})
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