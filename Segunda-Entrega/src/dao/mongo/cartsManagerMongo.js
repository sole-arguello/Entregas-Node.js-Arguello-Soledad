import { cartsModel } from "./models/carts.model.js";

export class CartsManagerMongo {
    
    constructor(){
        this.model = cartsModel
    }
    async getCarts(){
        try {
            const resultado = await this.model.find();
            return resultado;
        } catch (error) {
            console.log('get carrito', error.message);
            throw new Error('No se pudo obtener el listado de los carritos ', error.message);
        }   
    }

    async getCartsId(cartId) {

        try {//el id lo traigo igual que la DB _id
            const resultado = await this.model.findById(cartId).populate("products._id");
            return resultado;
        } catch (error) {
            console.log('get carrito', error.message);
            throw new Error('No se pudo obtener el carrito ', error.message);
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
    //metodo que actualiza el producto completo en el carrito y su cantidad
    async updateCartId(cartId, prodcutId) {
        try {
            //recibo el id y el producto
            const cart = await this.model.findByIdAndUpdate(cartId, prodcutId, { new: true });
            if (!cart) {
                throw new Error("No se pudo encontrar el carrito a actualizar");
            }
            return cart;
        } catch (error) {
            console.log('actualizar carrito', error.message);
            throw new Error('No se pudo actualizar el carrito ', error.message);
        }
    }
    //deberá poder actualizar SÓLO la cantidad de ejemplares del producto por 
    //cualquier cantidad pasada desde req.body
    async updateProductInCart(cartId, productId, newQuantity) {
        try {
            const cart = await this.getCartsId(cartId)
            const productIndex =  cart.products.findIndex((prod) => prod._id == productId)
            if(productIndex >= 0){
                cart.products[productIndex].quantity = newQuntity
                const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                return result
            }
         } catch (error) {
             console.log('actualizar carrito', error.message);
             throw new Error('No se pudo actualizar el carrito ', error.message);
         }
    }

    //metodo para elimina el carrito
    async deleteCartId(cartId) {
        try {
            const cart = await this.model.findByIdAndDelete(cartId);
            if (!cart) {
                throw new Error("No se pudo encontrar el carrito a eliminar");
            }
            return cart;
        } catch (error) {
            console.log('eliminar carrito', error.message);
            throw new Error('No se pudo eliminar el carrito ', error.message);
        }
    }

    //DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            const productExist = cart.products.find((prod) => prod._id == productId);
            if (productExist) {
                const newProducts = cart.products.filter((prod) => prod._id != productId);
                cart.products = newProducts
                const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                return result
            }else{
                throw new Error("No se pudo encontrar el producto a eliminar");
            }
        } catch (error) {
            console.log('eliminar carrito', error.message);
            throw new Error('No se pudo eliminar el carrito ', error.message);
        }
    }
    

}