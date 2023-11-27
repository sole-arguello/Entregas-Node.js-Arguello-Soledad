import { CartsService } from "../service/carts.service.js";
import { ProductsService } from "../service/products.service.js";
import { UsersSessionsService } from "../service/usersSessions.service.js";
import { TiketService } from "../service/tiket.service.js";
import { v4 as uuidv4 } from 'uuid';

export class CartsController {
    static getCarts = async (req, res) => {
        try {
            const carts = await CartsService.getCarts();
            console.log('getCarts controller');
            res.json({ message: "Listado de carritos", data: carts });
        } catch (error) {
            console.log('error getCarts controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static getCartsId = async (req, res) => {
        try {
            const idcarts = req.params.cid; //obtengo el parametro cid de la URL
            console.log('getCartsId controller');
            //tarigo el caarito por medio de la populacion
            const carts = await CartsService.getCartsId(idcarts);
            if(carts){
              console.log('getCartsId controller exist');
              res.json({ message: "Carrito encontrado", data: carts });
            }else{
              console.log('getCartsId controller no exist');
              res.json({ status: "error", message: "Carrito no encontrado"});
            }
            
          } catch (error) {
            console.log('error getCartsId controller', error.message);
            res.json({ status: "error", message: error.message });
          }
    }
    static createCart = async (req, res) => {
        try {
            const newCart = await CartsService.createCart();
            console.log('createCart controller');
            res.json({ message: "Carrito creado", data: newCart });
        } catch (error) {
            console.log('error createCart controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static updateCartId = async (req, res) => {
        try {
            console.log('updateCartId controller');

            const { cid: idCart } = req.params; //obtengo el id del carrito
            const newProduct = req.body;//obtengo el producto
            const updatedCart = await CartsService.updateCartId(idCart, newProduct);// le paso el id y el cuerpo 
            res.json({ message: "Carrito actualizado con exito", data: updatedCart });
        }
        catch (error) {
            console.log('error updateCartId controller', error.message);
            res.json({ status: "error",  message: error.message });
        }
    }
    static addProduct = async (req, res) => {
        try {
            console.log('addProduct controller');
            const { cid: idCarts, pid: idProduct } = req.params;
            const cart = await CartsService.getCartsId(idCarts);
            const result = await CartsService.addProduct(cart, idProduct);
            res.json({ message: "Producto agregado al carrito", data: result });
        } catch (error) {
            console.log('error addProduct controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static updateProductInCart = async (req, res) => {
        try {
            console.log('updateProductInCart controller');
            const { cid: idCarts, pid: idProduct } = req.params;
            const newQuantity  = req.body.newQuantity;
            const updatedCart = await CartsService.updateProductInCart(idCarts, idProduct, newQuantity);
            res.json({ message: "success", data: updatedCart });
        }
        catch (error) {
            console.log('error updateProductInCart controller', error.message);
            res.json({ status: "error",  message: error.message });
        }
    }
    static deleteCartId = async (req, res) => {
        try {
            console.log('deleteCartId controller');
            const { cid: idCarts } = req.params;
            const deletedCart = await CartsService.deleteCartId(idCarts);
            res.json({ message: "Carrito eliminado con exito", data: deletedCart });
            // res.json({ message: "Carrito con id ' " + cartId + " ' eliminado con exito", data: cartDeleted });
        }
        catch (error) {
            console.log('error deleteCartId controller', error.message);
            res.json({ status: "error",  message: error.message });
        }
    }
    static deleteProductInCart = async (req, res) => {
        try {
            console.log('deleteProductInCart controller');
            const { cid: idCarts, pid: idProduct } = req.params;
            const deletedProduct = await CartsService.deleteProductInCart(idCarts, idProduct);
            res.json({ message: "Producto eliminado del carrito", data: deletedProduct });
        }
        catch (error) {
            console.log('error deleteProductInCart controller', error.message);
            res.json({ status: "error",  message: error.message });
        }
    }
    static purchaseCart = async (req, res) => {
        try {
            console.log('purchaseCart controller');
            const { cid: idCarts } = req.params;;
            const cart = await CartsService.getCartsId(idCarts)
            //console.log('carrito con los productos a comprar:', cart); 
            const userId = req.user._id.toString()
            const user = await UsersSessionsService.getUserById(userId)  
            console.log('user:', user);
            
            
            //existe el carrito no vacio
            if(cart.products.length){
                //tiket de la compra y los rechazados
                const ticketProducts = []
                const rejectedProducts = []
                //varifico el stock de cada producto
                for(let i = 0; i < cart.products.length; i++){
                    const cartProduct = cart.products[i]
                    //console.log('Productos en carrito:', cartProduct);
                    const productInfo = cartProduct.productId._id.toString()
                    //console.log('informacion del producto:', productInfo);

                    //comparo la quantity con el stock
                    if(cartProduct.quantity <= productInfo.stock){
                        //agrego el producto al tiket
                        ticketProducts.push(cartProduct)
                        //resto el stock del producto comprado
                        productInfo.stock -= cartProduct.quantity
                        //actualizo el stock en la base de datos
                        await ProductsService.updateProduct(productInfo._id, ticketProducts[i].productId)
                        
                    }else{
                        //agrego los productos rechazados
                        rejectedProducts.push(cartProduct)
                    }
                }
                //console.log('tiketProducts:', ticketProducts);
                //console.log('rejectedProducts:', rejectedProducts);
                let total;
                for(let i=0; i < ticketProducts.length; i++){
                    //calculo el total de la compra y creo el tiket
                    total = ticketProducts.reduce((acc, item) => acc + item.quantity * item.productId.price, 0)
                }
                if(ticketProducts.length >= 1){
                    const newTicket = {
                        code: uuidv4(), 
                        purchase_datetime: new Date(),
                        amount: total,
                        purchaser: user.email,
                    }
                    //creo el tiket en la base de datos
                    const tiket = await TiketService.createTiket(newTicket);
                    console.log('Compra realizada Ticket:', tiket);
                    res.json({ status: "success", message: "Compra realizada", data: tiket });
                }
                //actualizo el stock de los productos rechazados
                if(rejectedProducts.length >= 1 && ticketProducts.length >= 1){
                    for(let i=0; i < ticketProducts.length; i++){
                        //datos del producto en el carrito, id del producto y el stock
                        let prodInTiket = ticketProducts[i]
                        let productId = prodInTiket.productId._id.toString()  
                        //controlo stock
                        let stock = prodInTiket.productId.stock 
                        //actualizo el stock de los rechazados
                        await ProductsService.updateProduct(productId, stock)                     
                        //elimino el procucto comprado del carrito
                        await CartsService.deleteProductInCart(idCarts, productId);
                    }
                    res.json({ status: "success", 
                    message: "Compra realizada, pero algunos productos no tienen stock", data: rejectedProducts });
                }else if(rejectedProducts.length >= 1 && ticketProducts.length == 0){//
                    console.log('Controller Purchase, productos rechazados por falta de stock');
                    res.json({ status: "error", 
                    message: "No es posible concretar la venta, por fatla de stock", data: rejectedProducts });
                }else{
                    //no hay productos en el carrito
                    for(let i=0; i < ticketProducts.length; i++){
                        //datos del producto en el carrito, id del producto y el stock
                        let prodInTiket = ticketProducts[i]
                        let productId = prodInTiket.productId._id.toString()
                        //elimino el procucto comprado del carrito
                        await CartsService.deleteProductInCart(idCarts, productId);
                    }
                    console.log('Controller Purchase ok, compra realizada');
                    res.json({ status: "success", message: "Compra realizada", data: ticketProducts });
                }

            }else{
                console.log('Controller Purchase ok, carrito vacio');
                res.json({ status: "error", message: "Carrito vacio" });
            }
        }
        catch (error) {
            console.log('error purchaseCart controller', error.message);
            res.json({ status: "error",  message: error.message });
        } 
    }
}
