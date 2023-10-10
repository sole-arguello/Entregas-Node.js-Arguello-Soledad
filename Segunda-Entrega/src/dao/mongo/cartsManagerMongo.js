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
            throw new Error('No se pudo obtener el listado de los carritos ', error.message);
        }
    }
    async createCart(productId){
        try {
            const newCart = {}
            const result = await this.model.create(newCart);
            return result
        } catch (error) {
            console.log('crear carrito', error.message);
            throw new Error('No se pudo crear el carrito ', error.message);
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            const cart = await this.model.findById(cartId);
            const newProductCart = {
                productId: productId,
                quantity: 1
            }
            cart.products.push(newProductCart);
            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
            return result
        } catch (error) {
            console.log('agregar producto', error.message);
            throw new Error('No se pudo agregar el producto ', error.message);
        }
    }
    //metodo que actualiza el producto completo en el carrito y su cantidad
    async updateCartId(cartId, prodcutId) {

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
    // async deleteProductInCart(cartId, productId) {
    //     try {
    //         const updatedCart = await this.model.
    //         findByIdAndUpdate(
    //                 cartId, 
    //                 { $pull: { "products": { "id": productId } } },
    //                 { new: true }
    //              ).populate("products._id");
    //         console.log ('CARRITO ACTUALIZADO', updatedCart);
    //         if (!updatedCart) {
    //             throw new Error("No se pudo encontrar el carrito a actualizar");
    //         }
    //         return updatedCart;
    //     } catch (error) {
    //         console.log('actualizar carrito', error.message);
    //         throw new Error('No se pudo actualizar el carrito ', error.message);
    //     }
    // }
    async deleteProductInCart(cartId, productId) {

        try {
            // Busca el carrito por su ID
            const cart = await this.model.findById(cartId);
            const productExist = cart.products.find((prod) => prod._id == productId);
            if (productExist ) {
                // Si el producto existe, elimina el producto
                const newProduct = cart.products.filter((prod) => prod._id != productId);
                cart.products = newProduct;
                const deletedProduct = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                return deletedProduct
            }else{
                throw new Error("El producto no existe en el carrito para ser eliminado");
            }
    
        } catch (error) {
            console.log('Eliminar producto del carrito', error.message);
            throw new Error('No se pudo eliminar el producto del carrito ', error.message);
        }
    }
    

}