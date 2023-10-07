import { cartsModel } from "./models/carts.model.js";

export class CartsManagerMongo {
    
    constructor(){
        this.model = cartsModel
    }

    async getCarts() {
        try {
            const resultado = await this.model.find();
            return resultado;
        } catch (error) {
            console.log('get carrito', error.message);
            throw new Error('No se pudo obtener el listado de los carritos ', error.message);
        }
    }
    async createCart(productId){
        try {
            const cart = await this.model.create({ productId: [{ productId, quantity: 1 }] });
            return cart
        } catch (error) {
            console.log('crear carrito', error.message);
            throw new Error('No se pudo crear el carrito ', error.message);
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            
            const cartFound = await this.model.findOneAndUpdate({_id: cartId},productId, {new: true} )
           
            if(!cartFound){
                throw new Error("No es posible obtener los carritos");
            }
            const productFound = cartFound.products.find((prod) => prod.id === productId);
            if(productFound){
                productFound.quantity += quantity
            }else{
                cartFound.products.push({
                    id: productId, 
                    quantity: quantity 
                });
            }
            await cartFound.save()
            return cartFound
        } catch (error) {
            console.log('agregar producto', error.message);
            throw new Error('No se pudo agregar el producto ', error.message);
        }
    }
}