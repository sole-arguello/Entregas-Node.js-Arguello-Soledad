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
            console.log('Estoy en purchaseCart controller');

            const { cid: idCarts } = req.params;
            const cart = await CartsService.getCartsId(idCarts)
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
                        console.log('Cantidad', cartProduct.quantity, 'stock', productInfo.stock);
                        //agrego el producto al tiket
                        ticketProducts.push(cartProduct)
                       // console.log('tiketProducts:', ticketProducts);
                        //resto el stock del producto comprado
                        const newStock = productInfo.stock -= cartProduct.quantity
                        console.log('newStock:', newStock);
                    }else{
                        console.log('Guardo los Rechazado')
                        //agrego los productos rechazados
                        rejectedProducts.push(cartProduct)
                    }
                }
                console.log('tiketProducts:', ticketProducts);
                console.log('rejectedProducts:', rejectedProducts);
                //calculo el total de la compra
                const total = ticketProducts.reduce((acc, item) => acc + item.quantity * item.productId.price, 0)
                console.log('total:', total);
                const newTicket = {
                    code: uuidv4(), 
                    purchase_datetime: new Date(),
                    amount: total,
                    purchaser: req.user.email,
                }
                const tiket = await TiketService.createTiket(newTicket);
                //res.json({ status: "success", message: "Compra realizada", data: tiket });
                if(rejectedProducts.length >=1 && ticketProducts.length >=1){
                    console.log('Compra con Rechazos', rejectedProducts);
                   
                    for(let i = 0; i < ticketProducts.length; i++){
                        //datos del producto, stock, y carrito
                        let productIdInCart = ticketProducts[i]
                        let productId = productIdInCart.productId._id
                        let stock = productIdInCart.stock
                        //console.log('productId:', productId, 'Id carrito:', idCarts, 'stock:', stock);

                        //actualizo el stock del producto en db y limpio el carrito 
                        await ProductsService.updateProduct(productId, {stock: stock})
                        await CartsService.deleteProductInCart(idCarts, productId)
     
                    }
                    console.log('Compra realizada y borro el producto del carrito, dejo el rechazado', rejectedProducts);
                    res.json({ status: "success", message: "Compra realizada, con rechazos", data: rejectedProducts });
                }else if(rejectedProducts.length >=1 && ticketProducts.length == 0){
                    console.log("no se puede comprar por falta de stock", rejectedProducts);
                    res.json({ status: "error", message: "no se puede comprar por falta de stock", data: rejectedProducts });
                
                }else{
                    for(let i = 0; i < ticketProducts.length; i++){
                        let productIdInCart = ticketProducts[i]
                        let productId = productIdInCart.productId._id
                        let stock = productIdInCart.productId.stock
                        //console.log('productId:', productId, 'Id carrito:', idCarts, 'stock:', stock);
                        
                        //actualizo el stock del producto y limpio el carrito
                        await ProductsService.updateProduct(productId, {stock: stock})
                        await CartsService.deleteProductInCart(idCarts, productId)
                      
                    }
                    console.log('compra realizada(sin rechazos), actualizo el stock y borro el producto del carrito'
                    , ticketProducts);
                    res.json({ status: "success", message: "compra realizda con exito", data: ticketProducts, tiket });
                }
            }else{
                console.log('Controller Purchase,  El carrito esta vacio');
                res.json({ status: "error", message: "El carrito no tiene productos" });
            }
        }
        catch (error) {
            console.log('error purchaseCart controller', error.message);
            res.json({ status: "error",  message: error.message });
        } 
    }
}