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
            const resultado = await this.model.findById(cartId).populate("products.productId").lean();
            return resultado;
        } catch (error) {
            console.log('get carrito', error.message);
            throw new Error('No se pudo obtener el carrito ', error.message);
        }
    }
    async createCart(){
        try {
            const newCart = {}
            const cart = await this.model.create(newCart);
            return cart
        } catch (error) {
            console.log('crear carrito', error.message);
            throw new Error('No se pudo crear el carrito ', error.message);
        }
    }
    //metodo que agrega productos al carrito
    async addProduct(cartId, productId) {
        try {
            let quantity = 1
            const cart = await this.model.findById(cartId);

            if(cart){
                const { products } = cart;
                const productExist = products.find((prod) => prod.productId == productId);
                if(productExist){
                    productExist.quantity += quantity;
                }else{
                    cart.products.push({ productId: productId, quantity: quantity }); 

                }
                const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                return result
            }else{
                throw new Error("No se pudo encontrar el carrito");
            }
        } catch (error) {
            console.log('agregar producto', error.message);
            throw new Error('No se pudo agregar el producto ', error.message);
        }
    }

    //PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos
    async updateCartId(cartId, newProduct) {
        try {
            const cart = await this.getCartsId(cartId)
            if(cart){
                if(!cart || cart.length === 0){
                    throw new Error("el carrito no contiene productos");
                }else{
                    cart.products = newProduct

                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                    return result
                }
            }else{
                throw new Error("No se pudo encontrar el carrito");
            }
            
        } catch (error) {
            console.log('actualizar carrito completo', error.message);
            throw new Error('No se pudo actualizar el carrito ');
        }
    }
    //deberá poder actualizar SÓLO la cantidad de ejemplares del producto por 
    //cualquier cantidad pasada desde req.body
    async updateProductInCart(cartId, productId, newQuantity) {
        try {
            const cart = await this.getCartsId(cartId)
            if(cart){
            
                const productIndex =  cart.products.findIndex((prod) => prod.productId._id == productId)
                          
                if(productIndex >= 0){
                    cart.products[productIndex].quantity = newQuantity
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                    return result
                }else{
                    throw new Error("No se pudo encontrar el producto");
                }
            }else{
                throw new Error("No se pudo encontrar el carrito");
            }

         } catch (error) {
             console.log('actualizar carrito', error.message);
             throw new Error('No se pudo actualizar el carrito ', error.message);
         }
    }
    
    //metodo para elimina el carrito
    async deleteCartId(cartId) {
        try {
            const cart = await this.getCartsId(cartId);
            if (!cart) {
                throw new Error("No se pudo encontrar el carrito a eliminar");
            }else{
                await this.model.findByIdAndDelete(cartId)
            }
            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
            return result;
        } catch (error) {
            console.log('eliminar carrito', error.message);
            throw new Error('No se pudo eliminar el carrito ', error.message);
        }
    }

    //DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            
            if(cart){
                const productExist = cart.products.find((prod) => prod.productId._id == productId);
                if (productExist) {
                    const newProducts = cart.products.filter((prod) => prod.productId._id != productId);
                    cart.products = newProducts
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                    return result
                }else{
                    throw new Error("No se pudo encontrar el producto a eliminar");
                }
            }else{
                throw new Error("No se pudo encontrar el producto en el carrito");
            }

        } catch (error) {
            console.log('eliminar carrito', error.message);
            throw new Error('No se pudo eliminar el producto del carrito ', error.message);
        }
    }
    

}