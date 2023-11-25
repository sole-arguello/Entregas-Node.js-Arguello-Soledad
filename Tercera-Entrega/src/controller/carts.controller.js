import { CartsService } from "../service/carts.service.js";
import { ProductsService } from "../service/products.service.js";
import { v4 as uuidv4 } from 'uuid';

export class CartsController {
    static getCarts = async (req, res) => {
        try {
            const carts = await CartsService.getCarts();
            res.json({ message: "Listado de carritos", data: carts });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
    static getCartsId = async (req, res) => {
        try {
            const idcarts = req.params.cid; //obtengo el parametro cid de la URL
            //tarigo el caarito por medio de la populacion
            const carts = await CartsService.getCartsId(idcarts);
            if(carts){
              res.json({ message: "Carrito encontrado", data: carts });
            }else{
              res.json({ status: "error", message: "Carrito no encontrado"});
            }
            
          } catch (error) {
            res.json({ status: "error", message: error.message });
          }
    }
    static createCart = async (req, res) => {
        try {
            const newCart = await CartsService.createCart();
            res.json({ message: "Carrito creado", data: newCart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
    static updateCartId = async (req, res) => {
        try {
            const { cid: idCart } = req.params; //obtengo el id del carrito
            const newProduct = req.body;//obtengo el producto
            const updatedCart = await CartsService.updateCartId(idCart, newProduct);// le paso el id y el cuerpo 
            res.json({ message: "Carrito actualizado con exito", data: updatedCart });
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        }
    }
    static addProduct = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const cart = await CartsService.getCartsId(idCarts);
            const product = await ProductsService.getProductById(idProduct);
            const result = await CartsService.addProduct(cart, product);
            res.json({ message: "Producto agregado al carrito", data: result });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
    static updateProductInCart = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const newQuantity  = req.body.newQuantity;
            const updatedCart = await CartsService.updateProductInCart(idCarts, idProduct, newQuantity);
            res.json({ message: "success", data: updatedCart });
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        }
    }
    static deleteCartId = async (req, res) => {
        try {
            const { cid: idCarts } = req.params;
            const deletedCart = await CartsService.deleteCartId(idCarts);
            res.json({ message: "Carrito eliminado con exito", data: deletedCart });
            // res.json({ message: "Carrito con id ' " + cartId + " ' eliminado con exito", data: cartDeleted });
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        }
    }
    static deleteProductInCart = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const deletedProduct = await CartsService.deleteProductInCart(idCarts, idProduct);
            res.json({ message: "Producto eliminado del carrito", data: deletedProduct });
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        }
    }
    static purchaseCart = async (req, res) => {
        try {
//------- comentar para probar lo de abajo
            const { cid: idCarts } = req.params;
            const cartTiket = await CartsService.purchaseCart(idCarts);
            res.json({ message: "Compra realizada con exito", data: cartTiket });


/******** FUNCIONA salvo el purchaser, y no impacta en DB*/
            // 
            // const { cid: idCarts } = req.params;
            // const cart = await CartsService.getCartsId(idCarts)
            
            // //console.log(cart);
            // if(cart.products.length){//existe el carrito no vacio
            //     const ticketProducts = []
            //     const rejectedProducts = []
            //     //varifico el stock de cada producto
            //     for(let i = 0; i < cart.products.length; i++){

            //         const cartProduct = cart.products[i]
            //         const productInfo = cartProduct.productId
            //         //console.log('Info:', productInfo); 

            //         //comparo cada producto quantity con el stock
            //         if(cartProduct.quantity <= productInfo.stock){
            //             //restar el stock del carrito
            //             productInfo.stock -= cartProduct.quantity
            //             ticketProducts.push(cartProduct)

            //             //actualizo el stock en la 
            //             await ProductsService.updateProduct(productInfo, ticketProducts[i].productId)
                        
            //         }else{
            //             rejectedProducts.push(cartProduct)//el que tiene stock de 10
            //         }
            //     }
            //     console.log('tiketProducts:', ticketProducts);
            //     console.log('rejectedProducts:', rejectedProducts);

            //     const newTicket = {
            //         code: uuidv4(), 
            //         purchase_datetimr: new Date(),
            //         amount: ticketProducts.reduce((acc, item) => acc + item.quantity * item.productId.price, 0),
            //         purchaser: req.user.email,
            //     }
            //     console.log('newTicket:', newTicket);
            //     res.json({ status: "success", message: "Compra realizada", data: newTicket });
                
            // }else{
            //     res.json({ status: "error", message: "El carrito no tiene productos" });
            // }
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        } 
    }
}
