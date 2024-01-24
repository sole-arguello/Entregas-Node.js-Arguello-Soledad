import { cartsService, productsService, ticketService } from "../repositories/index.js";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "../helpers/logger.js";

export class CartsController {
    static getCarts = async (req, res) => {
        try {
            const carts = await cartsService.getCarts();
            //console.log('getCarts controller');
            res.json({ message: "Listado de carritos", data: carts });
        } catch (error) {
            logger.error(error.message);
            //console.log('error getCarts controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static getCartsId = async (req, res) => {
        try {
            const idcarts = req.params.cid; //obtengo el parametro cid de la URL
            //console.log('getCartsId controller');
            //tarigo el caarito por medio de la populacion
            const carts = await cartsService.getCartsId(idcarts);
            if(carts){
              res.json({ message: "Carrito encontrado", data: carts });
            }else{
              res.json({ status: "error", message: "Carrito no encontrado"});
            }
            
          } catch (error) {
            logger.error(error.message);
            res.json({ status: "error", message: error.message });
          }
    }
    static createCart = async (req, res) => {
        try {
            const newCart = await cartsService.createCart();
            res.json({ message: "Carrito creado", data: newCart });
        } catch (error) {
            logger.error(error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static updateCartId = async (req, res) => {
        try {
            const { cid: idCart } = req.params; //obtengo el id del carrito
            const newProduct = req.body;//obtengo el producto
            const updatedCart = await cartsService.updateCartId(idCart, newProduct);// le paso el id y el cuerpo 
            res.json({ message: "Carrito actualizado con exito", data: updatedCart });
        }
        catch (error) {
            logger.error(error.message);
            res.json({ status: "error",  message: error.message });
        }
    }
    static addProduct = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const cart = await cartsServiceartsService.getCartsId(idCarts);
            const user = req.user.role;
            const userPremium = req.user._id.toString();
            const productOwner = product.owner.toString();
            if((productOwner === userPremium) && (user === "admin")) {
                res.json({status: "error", message: "No puedes agregar un producto a un carrito" })
            }else{
                const product = await cartsService.addProduct(cart, idProduct);
                res.json({ message: "success", data: product });
            }

            res.json({ message: "Producto agregado al carrito", data: result });
        } catch (error) {
            logger.info( error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static updateProductInCart = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const newQuantity  = req.body.newQuantity;
            const updatedCart = await cartsService.updateProductInCart(idCarts, idProduct, newQuantity);
            res.json({ message: "success", data: updatedCart });
        }
        catch (error) {
            logger.error(error.message);
            res.json({ status: "error",  message: error.message });
        }
    }
    static deleteCartId = async (req, res) => {
        try {
            const { cid: idCarts } = req.params;
            const deletedCart = await cartsService.deleteCartId(idCarts);
            res.json({ message: "Carrito eliminado con exito", data: deletedCart });
            // res.json({ message: "Carrito con id ' " + cartId + " ' eliminado con exito", data: cartDeleted });
        }
        catch (error) {
            logger.error(error.message);
            res.json({ status: "error",  message: error.message });
        }
    }
    static deleteProductInCart = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const deletedProduct = await cartsService.deleteProductInCart(idCarts, idProduct);
            res.json({ message: "Producto eliminado del carrito", data: deletedProduct });
        }
        catch (error) {
            logger.error(error.message);
            res.json({ status: "error",  message: error.message });
        }
    }
    static purchaseCart = async (req, res) => {
        try {
            const { cid: idCarts } = req.params;
            const cart = await cartsService.getCartsId(idCarts)
            //console.log('carrito con los productos a comprar:', cart);

            //verifico que el carrito no este vacio
            if(cart.products.length > 0){
                //tiket de la compra y los rechazados
                const ticketProducts = []
                const rejectedProducts = []

                //varifico el stock de cada producto
                for(let i = 0; i < cart.products.length; i++){

                    const cartProduct = cart.products[i]
                    //console.log('Productos en carrito:', cartProduct);
                    const productInfo = cartProduct.productId
                    //console.log('informacion del producto:', productInfo);

                    //comparo la quantity con el stock
                    if(cartProduct.quantity <= productInfo.stock){
                       // console.log('Cantidad', cartProduct.quantity, 'stock', productInfo.stock);
                        //agrego el producto al tiket
                        ticketProducts.push(cartProduct)
                       // console.log('tiketProducts:', ticketProducts);
                        //resto el stock del producto comprado
                        const newStock = productInfo.stock -= cartProduct.quantity
                        //console.log('newStock:', newStock);
                    }else{
                        //console.log('Guardo los Rechazado')
                        //agrego los productos rechazados
                        rejectedProducts.push(cartProduct)
                    }
                }
                //console.log('tiketProducts:', ticketProducts);
                //console.log('rejectedProducts:', rejectedProducts);
                //calculo el total de la compra
                const total = ticketProducts.reduce((acc, item) => acc + item.quantity * item.productId.price, 0)
                //console.log('total:', total);
                const newTicket = {
                    code: uuidv4(), 
                    purchase_datetime: new Date(),
                    amount: total,
                    purchaser: req.user.email,
                }
                const tiket = await ticketService.createTicket(newTicket);
                //res.json({ status: "success", message: "Compra realizada", data: tiket });
                if(rejectedProducts.length >=1 && ticketProducts.length >=1){
                    //console.log('Compra con Rechazos', rejectedProducts);
                   
                    for(let i = 0; i < ticketProducts.length; i++){
                        //datos del producto, stock, y carrito
                        let productIdInCart = ticketProducts[i]
                        let productId = productIdInCart.productId._id
                        let stock = productIdInCart.stock
                        //console.log('productId:', productId, 'Id carrito:', idCarts, 'stock:', stock);

                        //actualizo el stock del producto en db y limpio el carrito 
                        await productsService.updateProduct(productId, {stock: stock})
                        await cartsService.deleteProductInCart(idCarts, productId)
     
                    }
                    logger.info('Compra realizada y borro el producto del carrito, dejo el rechazado');
                    res.json({ status: "success", message: "Compra realizada, con rechazos", data: rejectedProducts });
                }else if(rejectedProducts.length >=1 && ticketProducts.length == 0){
                    logger.error('No se puede comprar por falta de stock')
                    res.json({ status: "error", message: "no se puede comprar por falta de stock", data: rejectedProducts });
                
                }else{
                    for(let i = 0; i < ticketProducts.length; i++){
                        let productIdInCart = ticketProducts[i]
                        let productId = productIdInCart.productId._id
                        let stock = productIdInCart.productId.stock
                        //console.log('productId:', productId, 'Id carrito:', idCarts, 'stock:', stock);
                        
                        //actualizo el stock del producto y limpio el carrito
                        await productsService.updateProduct(productId, {stock: stock})
                        await cartsService.deleteProductInCart(idCarts, productId)
                      
                    }

                    logger.info('compra realizada(sin rechazos), actualizo el stock y borro el producto del carrito');
                    res.json({ status: "success", message: "compra realizda con exito", data: ticketProducts, tiket });
                }
            }else{
                logger.error('Controller Purchase,  El carrito esta vacio');
                res.json({ status: "error", message: "El carrito no tiene productos" });
            }
        }
        catch (error) {
            logger.error('error purchaseCart controller', error.message);
            res.json({ status: "error",  message: error.message });
        } 
    }
}