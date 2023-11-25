import { cartsModel } from "./models/carts.model.js";
import { v4 as uuidv4 } from 'uuid';

export class CartsManagerMongo {
    
    constructor(){
        this.model = cartsModel
    }
    async getCarts(){
        try {
            const resultado = await this.model.find();
            console.log('getCarts con exito', resultado);
            return resultado;
        } catch (error) {
            console.log('error en manager get carrito: ', error.message);
            throw new Error('No se pudo obtener el listado de los carritos ', error.message);
        }   
    }

    async getCartsId(cartId) {

        try {//el id lo traigo igual que la DB _id
            const resultado = await this.model.findById(cartId).populate("products.productId").lean();
            console.log('getCartsId con exito', resultado);
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
            console.log('createCart con exito', cart);
            return cart
        } catch (error) {
            console.log('Error en manager createCart', error.message);
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
                console.log('addProduct con exito', result);
                return result
            }else{
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
                    console.log('updateCartId con exito', result);
                    return result
                }
            }else{
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
            
                const productIndex =  cart.products.findIndex((prod) => prod.productId._id == productId)
                          
                if(productIndex >= 0){
                    cart.products[productIndex].quantity = newQuantity
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true })
                    console.log('updateProductInCart con exito', result);
                    return result
                }else{
                    throw new Error("No se pudo encontrar el producto");
                }
            }else{
                throw new Error("No se pudo encontrar el carrito");
            }

         } catch (error) {
             console.log('Error en manager updateProductInCart', error.message);
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
            console.log('deleteCartId con exito', result);
            return result;
        } catch (error) {
            console.log('Error en manager deleteCartId:', error.message);
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
                    console.log('deleteProductInCart con exito', result);
                    return result
                }else{
                    throw new Error("No se pudo encontrar el producto a eliminar");
                }
            }else{
                throw new Error("No se pudo encontrar el producto en el carrito");
            }

        } catch (error) {
            console.log('Error en manager deleteProductInCart', error.message);
            throw new Error('No se pudo eliminar el producto del carrito ', error.message);
        }
    }

    async purchaseCart(cartId, purchaser){
        try {
            const cart = await this.getCartsId(cartId);

            console.log('cart product', cart.products);
//------ no me muetra nada este console.log
            //console.log('product info', cart.products.productId._id);

            //verifico si el carrito tiene productos
            if(cart.products.length){
                const ticketProducts = []
                const rejectedProducts = []
                //verifico el stock de cada producto del carrito
                for(let i = 0; i < cart.products.length; i++){
                    const cartProduct = cart.products;

//----- no recibo la informacion
                    const productInfo = cartProduct.productId._id
                    console.log('productInfo', productInfo);
                    
                    //comparo la cantidad comprada con el stock disponible
                    if(cartProduct.quantity <= productInfo.stock){
                        //resto el stock 
                        quantityCart -= stockProduct
                        ticketProducts.push(cartProduct)

//---pretendo reutilizar para actualizar el stock despues de la compra
                        await this.updateProductInCart(cartId, productInfo, quantityCart)
                    }else{
                        rejectedProducts.push(cartProduct)
                    }
                }
                console.log('ticketProducts', ticketProducts);
                console.log('rejectedProducts', rejectedProducts);

                const newTicket = {
                    code: uuidv4(), 
                    purchase_datetimr: new Date(),
                    amount: ticketProducts.reduce((acc, item) => acc + item.quantity * item.productId.price, 0),
                    //purchaser: ,
//no logro traer el purchaser
                } 
                console.log('newTicket', newTicket);
                return newTicket              
        
            }else{
                throw new Error('El carrito se encuntra vacio');
            }
            
        } catch (error) {
            throw new Error('No se encontro el carrito', error.message);``
        }
    }
    
}