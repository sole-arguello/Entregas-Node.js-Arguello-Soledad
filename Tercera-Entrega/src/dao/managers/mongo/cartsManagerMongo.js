import { cartsModel } from "./models/carts.model.js";

export class CartsManagerMongo {
    
    constructor(){
        this.model = cartsModel
    }
    async getCarts(){
        try {
            const resultado = await this.model.find();
            console.log('getCarts ok');
            return resultado;
        } catch (error) {
            console.log('error en manager get carrito: ', error.message);
            throw new Error('No se pudo obtener el listado de los carritos ', error.message);
        }   
    }

    async getCartsId(cartId) {

        try {//el id lo traigo igual que la DB _id
            const resultado = await this.model.findById(cartId).populate("products.productId").lean();
            console.log('getCartsId ok');
            return resultado;
        } catch (error) {
            console.log('get carrito', error.message);
            throw new Error('Error en manager getCartsId: ', error.message);
        }
    }
    async createCart(){
        try {
            const newCart = {}
            const cart = await this.model.create(newCart);
            console.log('createCart ok');
            return cart
        } catch (error) {
            console.log('Error en manager createCart', error.message);
            throw new Error('No se pudo crear el carrito ', error.message);
        }
    }
    //metodo que agrega productos al carrito
    async addProduct(cartId, productId) {
        try {
            let quantity = 1;
            const cart = await this.getCartsId(cartId);

            if(cart){
                
                const { products } = cart;
                const productExist = products.find((prod) => prod.productId._id.toString() === productId);
                if(productExist){
                    //si existe el producto, se suma la cantidad
                    productExist.quantity += 1;
                }else{
                    cart.products.push({ productId: productId, quantity: quantity }); 

                }
                const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true }).populate('products.productId');
                
                console.log('addProduct ok');
                return result
            }else{
                console.log('error en manager addProduct');
                throw new Error("No se pudo encontrar el carrito");
            }
        } catch (error) {
            console.log('Error en manager addProduct', error.message);
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
                    console.log('updateCartId ok');
                    return result
                }
            }else{
                console.log('error en manager updateCartId');
                throw new Error("No se pudo encontrar el carrito");
            }
            
        } catch (error) {
            console.log('Error en manager updateCartId', error.message);
            throw new Error('No se pudo actualizar el carrito ');
        }
    }
    //deberá poder actualizar SÓLO la cantidad de ejemplares del producto por 
    //cualquier cantidad pasada desde req.body
    async updateProductInCart(cartId, productId, newQuantity) {
        try {
            const cart = await this.getCartsId(cartId)
            if(cart){
            
                const productIndex =  cart.products.findIndex((prod) => prod.productId._id.toString() === productId)
                          
                if(productIndex >= 0){
                    cart.products[productIndex].quantity = newQuantity
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                    console.log('updateProductInCart ok');
                    return result
                }else{
                    console.log('error en manager updateProductInCart');
                    throw new Error("No se pudo encontrar el producto");
                }
            }else{
                console.log('error en manager updateProductInCart');
                throw new Error("No se pudo encontrar el carrito");
            }

         } catch (error) {
             console.log('Error en manager updateProductInCart', error.message);
             throw new Error('No se pudo actualizar el carrito ', error.message);
         }
    }
    
    //metodo para elimina el carrito
    async deleteCartId(cartId) {
        console.log('deleteCartId');
        try {
            const cart = await this.getCartsId(cartId);
            if (!cart) {
                console.log('error en manager deleteCartId');
                throw new Error("No se pudo encontrar el carrito a eliminar");
            }else{
                await this.model.findByIdAndDelete(cartId)
            }
            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
            console.log('deleteCartId');
            return result;
        } catch (error) {
            console.log('Error en manager deleteCartId:', error.message);
            throw new Error('No se pudo eliminar el carrito ', error.message);
        }
    }

    //DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
    async deleteProductInCart(cartId, productId) {
        try {
        
            const cart = await this.getCartsId(cartId);
            
            if(cart){
                const productExist = cart.products.find((prod) => prod.productId._id.toString() === productId.toString());
                if (productExist) {
                    const newProducts = cart.products.filter((prod) => prod.productId._id.toString() !== productId.toString());
                    cart.products = newProducts
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                    .populate('products.productId');
                    console.log('deleteProductInCart');
                    return result
                }else{
                    console.log('error en manager deleteProductInCart');
                    throw new Error("No se pudo encontrar el producto a eliminar");
                }
            }else{
                console.log('error en manager deleteProductInCart');
                throw new Error("No se pudo encontrar el producto en el carrito");
            }

        } catch (error) {
            console.log('Error en manager deleteProductInCart', error.message);
            throw new Error('No se pudo eliminar el producto del carrito ', error.message);
        }
    }

    
}