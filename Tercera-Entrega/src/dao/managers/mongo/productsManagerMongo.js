import { productsModel } from './models/products.model.js';

export class ProductsManagerMongo{

    constructor(){
        this.model = productsModel
    }

    //metodo para obtener productos del paginate
    async getProductsPaginate(query, options){
        try {
            const result = await this.model.paginate(query, options);
            console.log('getProductsPaginate con exito',result);
            return result
        } catch (error) {
            console.log('error en manager getProductsPaginate',error.message);
            throw new Error('No se pudo obtener el listado de  producto',error.message);
        }
    }

    async createProduct(infoProduct){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.create(infoProduct);
            console.log('createProduct con exito', resultado);
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('Error en manager createProduct',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo crea el producto',error.message);
        }
    }
    async getProducts(){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.find().lean();//soluciona el bloqueo de handelbarspara mostrar en home
            console.log('getProducts ok');
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('error en manager getProducts',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo obtener el listado de  producto',error.message);
        }
    }
    async getProductById(prodcutId){
        try {
            //uso el modelo definido y el metodo de mongo
            const resultado = await this.model.findById(prodcutId);//tambien se puede usar findOne({_id: id})
            console.log('getProductById con exito', resultado);
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('error en manager getProductById',error.message);
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
            console.log('updateProduct con exito', resultado);
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('Error en manager updateProduct',error.message);
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
            console.log('deleteProduct con exito', resultado);
            return resultado
        } catch (error) {
            //mensaje interno
            console.log('Error en manager deleteProduct',error.message);
            //nmensaje al cliente
            throw new Error('No se pudo encontrar el producto, para actualizarlo',error.message);
        }
    }
}